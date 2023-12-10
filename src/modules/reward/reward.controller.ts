import { QueryUser } from './../../decorators/user.decorator';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import {
  QueryRewardListInputDto,
  QueryRewardListOutDto,
} from './dto/query-reward.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrimaryKeyDto, ResponseDto } from 'src/common/base.dto';
import { QueryRewardDetailOutDto } from './dto/detail-reward.dto';
import { EntityAuth, EntityAuthGuard } from '../auth/entity.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Reward } from './entities/reward.entity';
import { ConfirmRewardAnswerDto } from './dto/confirm-reward-answer.dto';
import { FirstPostInterceptor } from 'src/interceptors/firstPost.interceptor';
import { EmailVerifyInterceptor } from 'src/interceptors/emailVerify.interceptor';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}
  @ApiOperation({ summary: '发布悬赏' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(EmailVerifyInterceptor, FirstPostInterceptor)
  @Post('/create')
  create(@Body() createRewardDto: CreateRewardDto, @QueryUser('id') userId) {
    return this.rewardService.create(createRewardDto, userId);
  }
  @ApiOperation({ summary: '查看悬赏列表' })
  @ApiBody({ type: QueryRewardListInputDto })
  @ApiResponse({ status: 201, type: QueryRewardListOutDto })
  @Post('/query')
  findAll(@Body() payload: QueryRewardListInputDto, @QueryUser('id') userId) {
    return this.rewardService.findAll(payload, userId);
  }

  @Post('query/findOne')
  queryFindOne(@Body() { id }: PrimaryKeyDto, @QueryUser('id') userId) {
    return this.rewardService.findOne(id, userId);
  }

  @ApiOperation({ summary: '查看悬赏详情' })
  @ApiResponse({ status: 201, type: QueryRewardDetailOutDto })
  @Post('/detail')
  async findOne(@Body() { id }: PrimaryKeyDto, @QueryUser('id') userId) {
    const reward = await this.rewardService.findOne(id, userId);
    await this.rewardService.incrViewCount(id);
    return reward;
  }
  @ApiOperation({ summary: '修改悬赏帖' })
  @ApiResponse({ type: ResponseDto })
  @EntityAuth(Reward, 'id')
  @UseGuards(JwtAuthGuard, EntityAuthGuard)
  @Post('/update')
  update(@Body() updateRewardDto: UpdateRewardDto, @QueryUser('id') userId) {
    return this.rewardService.update(updateRewardDto, userId);
  }
  @ApiOperation({ summary: '删除悬赏帖' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @UseGuards(JwtAuthGuard, EntityAuthGuard)
  @EntityAuth(Reward, 'id')
  @Post('/delete')
  remove(@Body() payload: PrimaryKeyDto, @QueryUser('id') userId) {
    return this.rewardService.canncel(payload.id, userId);
  }
  @ApiOperation({ summary: '确认某个回答为悬赏答案' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('/confirm')
  confirm(
    @Body() confirmRewardAnswerDto: ConfirmRewardAnswerDto,
    @QueryUser('id') userId,
  ) {
    return this.rewardService.confirm(confirmRewardAnswerDto, userId);
  }
}
