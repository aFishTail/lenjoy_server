import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { EntityTypeEnum, EventTypeEnum } from 'src/common/constants';
import { MainEntity } from 'src/common/types';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}
  async create(createEventDto: CreateEventDto) {
    const {
      fromType,
      type,
      content,
      entityType,
      entityId,
      fromUserId,
      toUserId,
    } = createEventDto;
    const fromUser = await this.userRepository.findOneBy({ id: fromUserId });
    const toUser = await this.userRepository.findOneBy({ id: toUserId });
    const event = await this.eventRepository.create({
      fromType,
      type,
      content,
      entityType,
      entityId,
      fromUser,
      toUser,
    });
    return this.eventRepository.save(event);
  }

  async findUserEvents(params: {
    toUserId: string;
    pageNum: number;
    pageSize: number;
  }) {
    const { toUserId, pageNum, pageSize } = params;
    const [records, total] = await this.eventRepository.findAndCount({
      where: {
        toUser: { id: toUserId },
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });
    return {
      records,
      total,
    };
  }

  generateUserEventContent(
    type: EventTypeEnum,
    entityType: EntityTypeEnum,
    entity: MainEntity,
  ) {
    let operate: string;
    let entityName: string;
    let entityTitleKey: string;
    switch (type) {
      case EventTypeEnum.comment:
        operate = '评论';
        break;
      case EventTypeEnum.like:
        operate = '点赞';
        break;
      case EventTypeEnum.unLike:
        operate = '取消赞';
        break;
      case EventTypeEnum.favorite:
        operate = '收藏';
        break;
      case EventTypeEnum.unFavorite:
        operate = '取消收藏';
        break;
    }
    switch (entityType) {
      case EntityTypeEnum.Topic:
        entityName = '帖子';
        entityTitleKey = 'title';
        break;
      case EntityTypeEnum.Resource:
        entityName = '资源';
        entityTitleKey = 'name';
        break;
      case EntityTypeEnum.Reward:
        entityName = '悬赏';
        entityTitleKey = 'name';
        break;
    }
    return `用户【${entity.user.nickname}】${operate}了你的${entityName}【${entity[entityTitleKey]}】`;
  }
}
