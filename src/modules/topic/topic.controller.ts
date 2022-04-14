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
import { QueryTopicDto, QueryTopicOutDto } from './dto/query-topic.dto';
import { Topic } from './entities/topic.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryDetailDto } from 'src/common/base.dto';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('topic')
@ApiTags('帖子管理')
export class TopicController {
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
  findAll(@Body() payload: QueryTopicDto) {
    console.log('payload', QueryTopicDto);
    return this.topicService.getList(payload);
  }

  @Post('/detail')
  async getDetail(@Body() param: QueryDetailDto, @User('id') userId) {
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
