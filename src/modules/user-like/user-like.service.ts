import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserLikeOperateDto } from './dto/user-like.dto';
import { UserLike } from './entities/user-like.entity';
import { EntityMap } from 'src/common/entityMap';
import { EventService } from '../event/event.service';
import {
  EntityTypeEnum,
  EventFromTypeEnum,
  EventTypeEnum,
} from 'src/common/constants';
import { OperateStatus } from 'src/common/types';

@Injectable()
export class UserLikeService {
  constructor(
    @InjectRepository(UserLike)
    private userLikeRepository: Repository<UserLike>,
    private dataSource: DataSource,
    private readonly eventService: EventService,
  ) {}
  async operate(userId, p: UserLikeOperateDto) {
    const { entityId, status, entityType } = p;
    const oldRecord = await this.userLikeRepository.findOne({
      where: { userId, entityId, entityType },
    });

    if (!oldRecord) {
      await this.dataSource.manager.transaction(async (manager) => {
        const userLikeRepository = manager.getRepository(UserLike);
        const newRecord = await userLikeRepository.create({
          userId,
          entityType,
          entityId,
          status: 1,
        });
        await userLikeRepository.save(newRecord);

        await manager.query(
          `update ${entityType} set like_count = like_count + 1 where id = '${entityId}'`,
        );
      });
      return null;
    }

    if (status === oldRecord.status) {
      throw new HttpException(
        `操作错误，不可重复${status === 1 ? '点赞' : '取消点赞'}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.dataSource.manager.transaction(async (manager) => {
      await manager
        .getRepository(UserLike)
        .update({ userId, entityType, entityId }, { status });
      const op = status ? '+' : '-';
      await manager.query(
        `update ${entityType} set like_count = like_count ${op} 1 where id = '${entityId}'`,
      );
    });
    return null;
  }

  async sendOperateEvent(params: {
    entityType: EntityTypeEnum;
    entityId: string;
    userId: string;
    status: OperateStatus;
  }) {
    const { entityType, entityId, userId, status } = params;
    const entity = await this.dataSource
      .getRepository(EntityMap[entityType])
      .createQueryBuilder(entityType)
      .where(`${entityType}.id = : id`, { id: entityId })
      .leftJoinAndSelect(`${entityType}.user`, 'user')
      .getOne();
    this.eventService.create({
      fromType: EventFromTypeEnum.user,
      type: EventTypeEnum.like,
      entityId: entityId,
      entityType: entityType,
      fromUserId: userId,
      content: this.eventService.generateUserEventContent(
        status ? EventTypeEnum.like : EventTypeEnum.unLike,
        entityType,
        entityId,
      ),
      toUserId: entity.user?.id,
    });
  }
}
