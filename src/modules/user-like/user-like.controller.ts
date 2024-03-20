import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserLikeService } from './user-like.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLikeOperateDto } from './dto/user-like.dto';
import { QueryUser } from 'src/decorators/user.decorator';
import { ResponseDto } from 'src/common/base.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EntityTypeEnum } from 'src/common/constants';

@ApiTags('用户点赞')
@Controller('userLike')
export class UserLikeController {
  constructor(private readonly userLikeService: UserLikeService) {}

  @ApiOperation({ summary: '点赞/取消点赞帖子' })
  @ApiBody({ type: UserLikeOperateDto })
  @ApiResponse({ type: ResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('/operate')
  async operateTopic(
    @Body() payload: UserLikeOperateDto,
    @QueryUser('id') userId,
  ) {
    await this.userLikeService.operate(userId, payload);
    this.userLikeService.sendOperateEvent({
      entityType: payload.entityType,
      entityId: payload.entityId,
      userId,
      status: payload.status,
    });
    return;
  }
}
