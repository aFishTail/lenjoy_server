import { ConfigService } from '@nestjs/config';
import * as url from 'url';
import * as qiniu from 'qiniu';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}
  uploadToQiniu(file: any) {
    const mac = new qiniu.auth.digest.Mac(
      this.configService.get<string>('qiniu.ak'),
      this.configService.get<string>('qiniu.sk'),
    );
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: this.configService.get<string>('qiniu.bucket'),
    });
    const uploadToken = putPolicy.uploadToken(mac);

    // uoload
    const formUploader = new qiniu.form_up.FormUploader(
      new qiniu.conf.Config({
        zone: qiniu.zone.Zone_z0,
      }),
    );
    const host = this.configService.get('qiniu.host');

    return new Promise((resolve, reject) => {
      formUploader.put(
        uploadToken,
        `${Date.now()}-${file.originalname}`,
        file.buffer,
        new qiniu.form_up.PutExtra(),
        function (respErr, respBody, respInfo) {
          if (respErr) {
            console.error(respErr);
            throw new InternalServerErrorException(respErr.message);
          }

          if (respInfo.statusCode == 200) {
            resolve({
              url: new url.URL(respBody.key, host).href,
            });
          } else {
            console.error(respInfo.statusCode, respBody);
            throw new InternalServerErrorException(respInfo);
          }
        },
      );
    });
  }
}
