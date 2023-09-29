import { QueryUser } from './../../decorators/user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { QueryUser } from 'src/decorators/user.decorator';
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

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @ApiOperation({ summary: '发布悬赏' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(@Body() createRewardDto: CreateRewardDto, @QueryUser('id') userId) {
    return this.rewardService.create(createRewardDto, userId);
  }

  @ApiOperation({ summary: '查看悬赏列表' })
  @ApiBody({ type: QueryRewardListInputDto })
  @ApiResponse({ status: 201, type: QueryRewardListOutDto })
  @Post('list')
  findAll(@QueryUser('id') userId, @Body() payload: QueryRewardListInputDto) {
    return this.rewardService.findAll(payload, userId);
  }

  @ApiOperation({ summary: '查看悬赏详情' })
  @ApiResponse({ status: 201, type: QueryRewardDetailOutDto })
  @Post('detail')
  findOne(@Body() { id }: PrimaryKeyDto, @QueryUser('id') userId) {
    return this.rewardService.findOne(id, userId);
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
  remove(payload: PrimaryKeyDto, @QueryUser('id') userId) {
    return this.rewardService.remove(payload.id, userId);
  }
}
