import {
  Controller,
  BadRequestException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import multer = require('multer');

@Controller('file')
export class FileController {
  @Post('upload/img/article')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          // cb(null, join(process.cwd(), 'upload'));
          cb(null, join(process.cwd(), 'public', '/img/article'));
        },
        filename: function (req, file, cb) {
          const unique = `${Date.now()}${Math.round(Math.random() * 1e9)}`;
          const imgPath = `${unique}.${file.mimetype.split('/')[1]}`;
          cb(null, imgPath);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 10,
      },
      fileFilter(req, file, cb) {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
          throw new BadRequestException(`只支持jpg, png格式`);
        }
        cb(null, true);
      },
    }),
  )
  async coverImport(@UploadedFile() file) {
    return { url: `/static/img/article/${file.filename}` };
  }
}
