import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserFavoriteService } from './user-favorite.service';
import { UserFavoriteOperateDto } from './dto/user-favorite.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryUser } from 'src/decorators/user.decorator';
import { UserLikeOperateDto } from '../user-like/dto/user-like.dto';
import { ResponseDto } from 'src/common/base.dto';

@ApiTags('用户收藏')
@Controller('userFavorite')
export class UserFavoriteController {
  constructor(private readonly userFavoriteService: UserFavoriteService) {}

  @ApiOperation({ summary: '收藏/取消收藏帖子' })
  @ApiBody({ type: UserFavoriteOperateDto })
  @ApiResponse({ type: ResponseDto })
  @Post('/topic')
  operateTopic(@Body() payload: UserLikeOperateDto, @QueryUser('id') userId) {
    return this.userFavoriteService.operate(userId, {
      ...payload,
      entityType: 'topic',
    });
  }
}
