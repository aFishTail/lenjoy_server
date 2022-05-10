import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-resource.dto';
import { UpdateTopicDto } from './dto/update-resource.dto';
import { QueryTopicListDto } from './dto/query-topic.dto';
import { Topic } from './entities/topic.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryDetailDto } from 'src/common/base.dto';
import { QueryUser } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EntityAuth, EntityAuthGuard } from '../auth/entity.guard';

@Controller('topic')
@ApiTags('帖子管理')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiOperation({ summary: '发布帖子' })
  @ApiResponse({ status: 201 })
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(@Body() payload: CreateTopicDto, @QueryUser('id') userId) {
    const { title, content, categoryId } = payload;
    return this.topicService.postTopic(userId, title, content, categoryId);
  }

  @ApiOperation({ summary: '查看帖子列表' })
  @ApiResponse({ status: 201 })
  @Post('/list')
  @ApiResponse({ type: [Topic] })
  findAll(@QueryUser('id') userId, @Body() payload: QueryTopicListDto) {
    return this.topicService.userList(userId, payload);
  }

  @ApiOperation({ summary: '查看帖子详情' })
  @ApiResponse({ status: 201 })
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

  @ApiOperation({ summary: '编辑帖子' })
  @ApiResponse({ status: 201 })
  @EntityAuth(Topic, 'id')
  @UseGuards(JwtAuthGuard)
  @Post('/update')
  update(@Body() payload: UpdateTopicDto) {
    return this.topicService.update(payload);
  }

  @ApiOperation({ summary: '删除帖子' })
  @ApiResponse({ status: 201 })
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
  create(@Body() payload: CreateTopicDto, @QueryUser('id') userId) {
    const { title, content, categoryId } = payload;
    return this.topicService.create(userId, title, content, categoryId);
  }

  @Post('/list')
  @ApiResponse({ type: [Topic] })
  findAll(@QueryUser('id') userId, @Body() payload: QueryTopicListDto) {
    return this.topicService.getList(userId, payload);
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
