import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-resource.dto';
import { UpdateTopicDto } from './dto/update-resource.dto';
import { Request } from 'express';
import {
  QueryTopicDto,
  QueryTopicListDto,
  QueryTopicOutDto,
} from './dto/query-topic.dto';
import { Topic } from './entities/topic.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryDetailDto } from 'src/common/base.dto';
import { QueryUser } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EntityAuth, EntityAuthGuard } from '../auth/entity.guard';

@Controller('topic')
@ApiTags('帖子管理')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiResponse({ status: 201, description: '发布帖子' })
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(@Body() createResourceDto: CreateTopicDto, @QueryUser('id') userId) {
    return this.topicService.create(userId, createResourceDto);
  }

  @ApiResponse({ status: 201, description: '查看帖子列表' })
  @Post('/list')
  @ApiResponse({ type: [Topic] })
  findAll(@Body() payload: QueryTopicListDto) {
    return this.topicService.getList(payload);
  }

  @ApiResponse({ status: 201, description: '查看帖子详情' })
  @Post('/detail')
  async getDetail(@Body() param: QueryDetailDto, @QueryUser('id') userId) {
    const { id } = param;
    console.log('userId', userId);
    const topic = await this.topicService.findOne(id);
    if (!topic) {
      throw new BadRequestException('帖子不存在');
    }
    await this.topicService.IncrViewCount(id);
    return topic;
  }
  // TODO: 需要发帖人本人才可以修改
  @ApiResponse({ status: 201, description: '编辑帖子' })
  @UseGuards(JwtAuthGuard)
  @Post('/update')
  update(@Body() payload: UpdateTopicDto) {
    return this.topicService.update(payload);
  }

  // TODO: 需要发帖人本人才可以删除
  @ApiResponse({ status: 201, description: '删除帖子' })
  @EntityAuth(Topic, 'id')
  @UseGuards(JwtAuthGuard, EntityAuthGuard)
  @Post('/delete')
  remove(@Body() payload: { id: string }) {
    return this.topicService.delete(payload.id);
  }
}

@Controller('admin/topic')
@ApiTags('管理平台-帖子管理')
export class AdminTopicController {
  constructor(private readonly topicService: TopicService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(@Body() createResourceDto: CreateTopicDto, @Req() request: Request) {
    console.log('req', request);
    const { user } = request as any;
    return this.topicService.create(user.id, createResourceDto);
  }

  @Post('/list')
  @ApiResponse({ type: [Topic] })
  findAll(@Body() payload: QueryTopicListDto) {
    return this.topicService.getList(payload);
  }

  @Post('/detail')
  async getDetail(@Body() param: QueryDetailDto, @QueryUser('id') userId) {
    const { id } = param;
    console.log('userId', userId);
    const topic = await this.topicService.findOne(id);
    if (!topic) {
      throw new BadRequestException('帖子不存在');
    }
    await this.topicService.IncrViewCount(id);
    return topic;
  }

  @Post('/update')
  update(@Body() updateResourceDto: UpdateTopicDto) {
    return this.topicService.update(updateResourceDto);
  }

  @Post('/delete')
  remove(@Body() payload: { id: string }) {
    return this.topicService.delete(payload.id);
  }
}
