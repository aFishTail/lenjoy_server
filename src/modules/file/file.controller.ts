import {
  Controller,
  BadRequestException,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import multer = require('multer');
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { type } from 'os';
import { UploadArticleImageInputDto } from './dto/article-upload.dto';

@Controller('file')
export class FileController {
  @ApiOperation({ summary: '上传文章图片' })
  @ApiBody({ type: UploadArticleImageInputDto })
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
    const serverAddr = 'http://81.69.252.155:6060';
    return { url: `${serverAddr}/static/img/article/${file.filename}` };
  }

  @ApiOperation({ summary: '上传用户头像' })
  @ApiBody({ type: UploadArticleImageInputDto })
  @Post('upload/img/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          // cb(null, join(process.cwd(), 'upload'));
          cb(null, join(process.cwd(), 'public', '/img/avatar'));
        },
        filename: function (req, file, cb) {
          const unique = `${Date.now()}${Math.round(Math.random() * 1e9)}`;
          const imgPath = `${unique}.${file.mimetype.split('/')[1]}`;
          cb(null, imgPath);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 4,
      },
      fileFilter(req, file, cb) {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
          throw new BadRequestException(`只支持jpg, png格式`);
        }
        cb(null, true);
      },
    }),
  )
  async uploadAvatar(@UploadedFile() file) {
    return { url: `/static/img/avatar/${file.filename}` };
  }
}
