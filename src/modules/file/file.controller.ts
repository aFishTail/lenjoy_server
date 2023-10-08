import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { UploadArticleImageInputDto } from './dto/article-upload.dto';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @ApiOperation({ summary: '上传文章图片' })
  @ApiBody({ type: UploadArticleImageInputDto })
  @Post('upload/img/article')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    return this.fileService.uploadToQiniu(file);
  }

  @ApiOperation({ summary: '上传用户头像' })
  @ApiBody({ type: UploadArticleImageInputDto })
  @Post('upload/img/avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(@UploadedFile() file) {
    return this.fileService.uploadToQiniu(file);
  }
}
