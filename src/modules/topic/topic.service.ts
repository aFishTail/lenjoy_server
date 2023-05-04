import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, getConnection, Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { CategoryService } from 'src/modules/category/category.service';
import { QueryTopicListInputDto } from './dto/query-topic.dto';
import { UserLike } from '../user-like/entities/user-like.entity';
import { ScoreService } from '../score/score.service';
import { ScoreOperateType } from '../score/entities/score.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    private readonly categoryService: CategoryService,
    private readonly scoreService: ScoreService,
    private readonly dataSource: DataSource,
  ) {}
  async create(
    userId: string,
    title: string,
    content: string,
    summary: string,
    categoryId: string,
  ) {
    const existCategory = await this.categoryService.findById(categoryId);
    const newReource = await this.topicRepository.create({
      title,
      content,
      summary,
      category: existCategory,
      userId,
    });
    await this.topicRepository.save(newReource);
    return newReource;
  }
  async postTopic(
    userId: string,
    title: string,
    content: string,
    summary: string,
    categoryId: string,
  ) {
    // 校验用户邮箱有没有认证
    const user = await this.dataSource
      .getRepository(User)
      .findOneBy({ id: userId });
    if (!user.emailVerified) {
      throw new BadRequestException('用户邮箱未认证');
    }

    const topic = await this.create(
      userId,
      title,
      content,
      summary,
      categoryId,
    );
    await this.scoreService.operate(
      userId,
      ScoreOperateType.INCREASE,
      topic.id,
      'topic',
    );
    return null;
  }

  async findAll() {
    const qb = this.topicRepository
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.category', 'category');
    const data = await qb.getMany();
    return data;
  }

  async getList(userId: string, payload: QueryTopicListInputDto) {
    const { pageNum, pageSize, title, startTime, endTime, categoryLabel } =
      payload;
    const qb = this.topicRepository
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.category', 'category')
      .leftJoinAndMapOne(
        'topic.user',
        'user',
        'user',
        'user.id = topic.user_id',
      );

    //TODO: 关联查询选取字段
    if (userId) {
      qb.where('topic.user_id= :userId', { userId });
    }
    if (categoryLabel) {
      qb.andWhere('topic.categoryLabel = :categoryLabel', { categoryLabel });
    }
    if (title) {
      qb.andWhere('topic.title LIKE :title', { title: `%${title}%` });
    }
    if (startTime && endTime) {
      qb.andWhere('topic.create_at BETWEEN :startTime AND :endTime', {
        startTime,
        endTime,
      });
    }
    qb.take(pageSize).skip((pageNum - 1) * pageSize);
    const [records, total] = await qb.getManyAndCount();
    return {
      records,
      total,
    };
  }
  // 查询用户帖子列表
  async userList(userId: string, payload: QueryTopicListInputDto) {
    const {
      title,
      pageNum,
      pageSize,
      categoryLabel,
      userId: topicUserId,
    } = payload;
    const qb = this.topicRepository
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.category', 'category')
      .leftJoinAndMapOne(
        'topic.user',
        'user',
        'user',
        'user.id = topic.user_id',
      )
      .orderBy('topic.create_at', 'DESC');

    if (title) {
      qb.andWhere('topic.title LIKE :title', { title: `%${title}%` });
    }
    if (userId) {
      qb.andWhere('topic.user_id = :userId', { userId: topicUserId });
    }
    if (categoryLabel) {
      qb.andWhere('category.label = :label', { label: categoryLabel });
    }
    qb.limit(pageSize).offset((pageNum - 1) * pageSize);
    const [records, total] = await qb.getManyAndCount();
    const result = [];
    for (let i = 0; i < records.length; i++) {
      const n = { ...records[i], isLike: 0 };
      // const like = await getConnection()
      const like = await this.dataSource
        .getRepository(UserLike)
        .findOne({ where: { userId, entityId: n.id } });
      if (like) {
        n.isLike = like.status;
      }
      result.push(n);
    }
    const data = {
      records: result,
      total,
    };
    return data;
  }

  async findOne(id: string) {
    const qb = this.topicRepository
      .createQueryBuilder('topic')
      .leftJoinAndMapOne(
        'topic.user',
        'user',
        'user',
        'user.id = topic.user_id',
      )
      .where({ id });
    const topic = await qb.getOne();
    return topic;
  }

  async update(p: UpdateTopicDto) {
    const { id, title, content, categoryId } = p;
    const oldTopic = await this.topicRepository.findOne({
      where: { id },
    });
    const newTopic = {
      ...oldTopic,
      title,
      content,
    };
    if (categoryId) {
      newTopic.category = await this.categoryService.findById(categoryId);
    }
    const updatedTopic = this.topicRepository.merge(oldTopic, newTopic);
    return await this.topicRepository.save(updatedTopic);
  }

  async delete(id: string) {
    const data = await this.topicRepository.findOne({
      where: { id },
    });
    await this.topicRepository.remove(data);
    return null;
  }

  async IncrViewCount(id: string) {
    await this.topicRepository
      .createQueryBuilder()
      .update(Topic)
      .set({
        viewCount: () => 'view_count + 1',
      })
      .where('id = :id', { id })
      .execute();
  }

  async adminGetList(payload: QueryTopicListInputDto) {
    const {
      pageNum,
      pageSize,
      title,
      startTime,
      endTime,
      categoryLabel,
      categoryId,
    } = payload;
    const qb = this.topicRepository
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.category', 'category')
      .leftJoinAndMapOne(
        'topic.user',
        'user',
        'user',
        'user.id = topic.user_id',
      );

    if (categoryLabel) {
      qb.andWhere('topic.categoryLabel = :categoryLabel', { categoryLabel });
    }
    if (categoryId) {
      qb.andWhere('topic.categoryId = :categoryId', { categoryId });
    }
    if (title) {
      qb.andWhere('topic.title LIKE :title', { title: `%${title}%` });
    }
    if (startTime && endTime) {
      qb.andWhere('topic.create_at BETWEEN :startTime AND :endTime', {
        startTime,
        endTime,
      });
    }
    qb.take(pageSize).skip((pageNum - 1) * pageSize);
    const [records, total] = await qb.getManyAndCount();
    const data = {
      records,
      total,
    };
    return data;
  }

  async adminGetDetail(id: string) {
    const qb = this.topicRepository
      .createQueryBuilder('topic')
      .leftJoinAndMapOne(
        'topic.user',
        'user',
        'user',
        'user.id = topic.user_id',
      )
      .where({ id });
    const topic = await qb.getOne();
    if (!topic) {
      throw new BadRequestException('帖子不存在');
    }
    return topic;
  }

  async adminDelete(id: string) {
    const data = await this.topicRepository.findOne({
      where: { id },
    });
    await this.topicRepository.remove(data);
    return null;
  }
}
