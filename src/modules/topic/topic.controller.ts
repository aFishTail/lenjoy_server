import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { QueryTopicListDto, QueryTopicListOutDto } from './dto/query-topic.dto';
import { Topic } from './entities/topic.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PrimaryKeyDto,
  QueryTopicDetailInputDto,
  QueryTopicDetailOutDto,
  ResponseDto,
} from 'src/common/base.dto';
import { QueryUser } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EntityAuth, EntityAuthGuard } from '../auth/entity.guard';

@Controller('topic')
@ApiTags('帖子管理')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiOperation({ summary: '发布帖子' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(@Body() payload: CreateTopicDto, @QueryUser('id') userId) {
    const { title, content, summary, categoryId } = payload;
    return this.topicService.postTopic(
      userId,
      title,
      content,
      summary,
      categoryId,
    );
  }

  @ApiOperation({ summary: '查看帖子列表' })
  @ApiBody({ type: QueryTopicListDto })
  @ApiResponse({ status: 201, type: QueryTopicListOutDto })
  @Post('/list')
  findAll(@QueryUser('id') userId, @Body() payload: QueryTopicListDto) {
    return this.topicService.userList(userId, payload);
  }

  @ApiOperation({ summary: '查看帖子详情' })
  @ApiResponse({ status: 201, type: QueryTopicDetailOutDto })
  @Post('/detail')
  async getDetail(
    @Body() payload: QueryTopicDetailInputDto,
    @QueryUser('id') userId,
  ) {
    const { id } = payload;
    console.log('userId', userId);
    const topic = await this.topicService.findOne(id);
    if (!topic) {
      throw new BadRequestException('帖子不存在');
    }
    await this.topicService.IncrViewCount(id);
    return topic;
  }

  @ApiOperation({ summary: '编辑帖子' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @EntityAuth(Topic, 'id')
  @UseGuards(JwtAuthGuard)
  @Post('/update')
  update(@Body() payload: UpdateTopicDto) {
    return this.topicService.update(payload);
  }

  @ApiOperation({ summary: '删除帖子' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @EntityAuth(Topic, 'id')
  @UseGuards(JwtAuthGuard, EntityAuthGuard)
  @Post('/delete')
  remove(@Body() payload: PrimaryKeyDto) {
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
    const { title, content, summary, categoryId } = payload;
    return this.topicService.create(
      userId,
      title,
      content,
      summary,
      categoryId,
    );
  }

  @Post('/list')
  @ApiResponse({ type: [Topic] })
  findAll(@QueryUser('id') userId, @Body() payload: QueryTopicListDto) {
    return this.topicService.getList(userId, payload);
  }

  @Post('/detail')
  async detail(@Body() param: PrimaryKeyDto, @QueryUser('id') userId) {
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
