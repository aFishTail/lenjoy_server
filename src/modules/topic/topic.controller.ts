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
import {
  QueryTopicListInputDto,
  QueryTopicListOutDto,
} from './dto/query-topic.dto';
import { Topic } from './entities/topic.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PrimaryKeyDto,
  QueryTopicDetailOutDto,
  ResponseDto,
} from 'src/common/base.dto';
import { QueryUser } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EntityAuth, EntityAuthGuard } from '../auth/entity.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';

@Controller('topic')
@ApiTags('帖子管理')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiOperation({ summary: '发布帖子' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @UseGuards(JwtAuthGuard, EntityAuthGuard)
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
  @ApiBody({ type: QueryTopicListInputDto })
  @ApiResponse({ status: 201, type: QueryTopicListOutDto })
  @Post('/list')
  findAll(@QueryUser('id') userId, @Body() payload: QueryTopicListInputDto) {
    return this.topicService.userList(userId, payload);
  }

  @ApiOperation({ summary: '查看帖子详情' })
  @ApiResponse({ status: 201, type: QueryTopicDetailOutDto })
  @Post('/detail')
  async getDetail(@Body() payload: PrimaryKeyDto, @QueryUser('id') userId) {
    const { id } = payload;
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
  @UseGuards(JwtAuthGuard, EntityAuthGuard)
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

@ApiTags('管理平台-帖子管理')
@Roles('admin')
@UseGuards(RolesGuard)
@Controller('admin/topic')
export class AdminTopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiOperation({ summary: '管理员创建帖子' })
  @ApiResponse({ status: 201, type: ResponseDto })
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

  @ApiOperation({ summary: '查询帖子列表' })
  @ApiResponse({ type: QueryTopicListOutDto })
  @Post('/list')
  findAll(@Body() payload: QueryTopicListInputDto) {
    return this.topicService.adminGetList(payload);
  }

  @ApiOperation({ summary: '查询帖子详情' })
  @ApiResponse({ type: QueryTopicDetailOutDto })
  @Post('/detail')
  async detail(@Body() param: PrimaryKeyDto) {
    const { id } = param;
    const topic = await this.topicService.adminGetDetail(id);
    return topic;
  }

  @ApiOperation({ summary: '修改帖子' })
  @ApiResponse({ type: ResponseDto })
  @Post('/update')
  update(@Body() updateResourceDto: UpdateTopicDto) {
    return this.topicService.update(updateResourceDto);
  }

  @ApiOperation({ summary: '删除帖子' })
  @ApiResponse({ type: ResponseDto })
  @Post('/delete')
  remove(@Body() payload: PrimaryKeyDto) {
    return this.topicService.adminDelete(payload.id);
  }
}
