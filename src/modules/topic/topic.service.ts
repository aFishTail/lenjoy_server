import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-resource.dto';
import { UpdateTopicDto } from './dto/update-resource.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { CategoryService } from 'src/modules/category/category.service';
import { QueryTopicDto } from './dto/query-topic.dto';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    private readonly categoryService: CategoryService,
  ) {}
  async create(userId: string, resource: Partial<Topic>) {
    const { category } = resource;
    const existCategory = await this.categoryService.findById(category);
    const newReource = await this.topicRepository.create({
      ...resource,
      category: existCategory,
      userId,
    });
    await this.topicRepository.save(newReource);
    return newReource;
  }

  async findAll() {
    const qb = this.topicRepository
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.category', 'category');
    const data = await qb.getMany();
    return data;
  }
  async getList(payload: QueryTopicDto) {
    const { pageNum, pageSize, userId, title, startTime, endTime, categoryId } =
      payload;
    const qb = this.topicRepository
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.category', 'category')
      .take(pageSize)
      .skip((pageNum - 1) * pageSize);
    if (userId) {
      qb.where('topic.user_id= :userId', { userId });
    }
    if (categoryId) {
      qb.andWhere('topic.categoryId = :categoryId', { categoryId });
    }
    if (title) {
      qb.andWhere('topic.title LIKE :title', { title });
    }
    if (startTime && endTime) {
      qb.andWhere('topic.create_at BETWEEN :startTime AND :endTime', {
        startTime,
        endTime,
      });
    }
    const [records, total] = await qb.getManyAndCount();
    const data = {
      records,
      total,
    };
    return data;
  }

  async findOne(id: string) {
    const topic = await this.topicRepository.findOne(id);
    return topic;
    // if (!topic) {}
  }

  async update(updateTopicDto: UpdateTopicDto) {
    const { id, title, content, categoryId } = updateTopicDto;
    const oldTopic = await this.topicRepository.findOne(id);
    const newTopic = {
      ...oldTopic,
      title,
      content,
    };
    if (categoryId) {
      newTopic.category = await this.categoryService.findById(categoryId);
    }
    const updatedTopic = this.topicRepository.merge(oldTopic, newTopic);
    return this.topicRepository.save(updatedTopic);
  }

  async delete(id: string) {
    const data = await this.topicRepository.findOne(id);
    this.topicRepository.remove(data);
    return null;
  }

  async IncrViewCount(id: string) {
    this.topicRepository
      .createQueryBuilder()
      .update(Topic)
      .set({
        viewCount: () => 'view_count + 1',
      })
      .where('id = :id', { id })
      .execute();
  }
}
