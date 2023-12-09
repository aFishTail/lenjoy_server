import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RewardAnswerService } from './reward-answer.service';
import { CreateRewardAnswerDto } from './dto/create-reward-answer.dto';
import { UpdateRewardAnswerDto } from './dto/update-reward-answer.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrimaryKeyDto, ResponseDto } from 'src/common/base.dto';
import { QueryUser } from 'src/decorators/user.decorator';
import { QueryRewardListInputDto } from './dto/query-reward-answer.dto';

@Controller('rewardAnswer')
export class RewardAnswerController {
  constructor(private readonly rewardAnswerService: RewardAnswerService) {}

  @ApiOperation({ summary: '回复悬赏' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(
    @Body() createRewardAnswerDto: CreateRewardAnswerDto,
    @QueryUser('id') userId,
  ) {
    return this.rewardAnswerService.create(createRewardAnswerDto, userId);
  }

  @ApiOperation({ summary: '查询悬赏列表' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @Post('/query')
  findAll(
    @Body() payload: QueryRewardListInputDto,
    @QueryUser('id') userId: string,
  ) {
    return this.rewardAnswerService.findAll(payload, userId);
  }

  @ApiOperation({ summary: '修改悬赏帖子的回答' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('/update')
  update(@Body() updateRewardAnswerDto: UpdateRewardAnswerDto) {
    return this.rewardAnswerService.update(updateRewardAnswerDto);
  }

  @ApiOperation({ summary: '删除悬赏评论' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('/delete')
  remove(@Body() { id }: PrimaryKeyDto) {
    return this.rewardAnswerService.remove(id);
  }
}
