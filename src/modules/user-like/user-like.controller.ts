import { Controller, Post, Body } from '@nestjs/common';
import { UserLikeService } from './user-like.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLikeOperateDto } from './dto/user-like.dto';
import { QueryUser } from 'src/decorators/user.decorator';
import { ResponseDto } from 'src/common/base.dto';

@ApiTags('用户点赞')
@Controller('userLike')
export class UserLikeController {
  constructor(private readonly userLikeService: UserLikeService) {}

  @ApiOperation({ summary: '点赞/取消点赞帖子' })
  @ApiBody({ type: UserLikeOperateDto })
  @ApiResponse({ type: ResponseDto })
  @Post('/operate')
  operateTopic(@Body() payload: UserLikeOperateDto, @QueryUser('id') userId) {
    return this.userLikeService.operate(userId, payload);
  }

  // @ApiOperation({ summary: '点赞/取消点赞评论' })
  // @ApiBody({ type: UserLikeOperateDto })
  // @ApiResponse({ status: 200, type: ResponseDto })
  // @Post('/comment')
  // operateComment(@Body() payload: UserLikeOperateDto, @QueryUser('id') userId) {
  //   return this.userLikeService.operate(userId, {
  //     ...payload,
  //     entityType: 'comment',
  //   });
  // }
}
