import { UseGuards, Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseDto, PrimaryKeyDto } from 'src/common/base.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { Roles, RolesGuard } from 'src/modules/auth/roles.guard';
import { QueryTopicDetailOutDto } from 'src/modules/topic/dto/detail-topic.dto';
import { RewardAdminService } from './rewarAdmin.service';

@ApiTags('管理平台-帖子管理')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/reward')
export class AdminTopicController {
  constructor(private readonly rewardAdminService: RewardAdminService) {}

  @ApiOperation({ summary: '查询悬赏列表' })
  @Post('/list')
  findAll(@Body() payload) {
    return this.rewardAdminService.findAll(payload);
  }

  @ApiOperation({ summary: '查询悬赏详情' })
  @ApiResponse({ type: QueryTopicDetailOutDto })
  @Post('/detail')
  async detail(@Body() param: PrimaryKeyDto) {
    const { id } = param;
    const topic = await this.rewardAdminService.findOne(id);
    return topic;
  }

  @ApiOperation({ summary: '删除悬赏' })
  @ApiResponse({ type: ResponseDto })
  @Post('/delete')
  remove(@Body() payload: PrimaryKeyDto) {
    return this.rewardAdminService.remove(payload.id);
  }
}
