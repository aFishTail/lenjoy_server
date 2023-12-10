import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserLikeOperateDto } from './dto/user-like.dto';
import { UserLike } from './entities/user-like.entity';

@Injectable()
export class UserLikeService {
  constructor(
    @InjectRepository(UserLike)
    private userLikeRepository: Repository<UserLike>,
    private dataSource: DataSource,
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
      await manager.getRepository(UserLike).update({ userId }, { status });
      const op = status ? '+' : '-';
      await manager.query(
        `update ${entityType} set like_count = like_count ${op} 1 where id = '${entityId}'`,
      );
    });
    return null;
  }
}
