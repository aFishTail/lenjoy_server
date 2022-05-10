import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getManager, Repository } from 'typeorm';
import { UserLikeOperateDto } from './dto/user-like.dto';
import { UserLike } from './entities/user-like.entity';

@Injectable()
export class UserLikeService {
  constructor(
    @InjectRepository(UserLike)
    private userLikeRepository: Repository<UserLike>,
  ) {}
  async operate(userId, p: UserLikeOperateDto & { entityType: string }) {
    const { entityId, status, entityType } = p;
    const oldRecord = await this.userLikeRepository.findOne({ userId });

    if (!oldRecord) {
      await getManager().transaction(async (manager) => {
        const _repository = manager.getRepository(UserLike);
        const newRecord = await _repository.create({
          userId,
          entityType,
          entityId,
          status: 1,
        });
        await _repository.save(newRecord);

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

    await getManager().transaction(async (manager) => {
      await manager.getRepository(UserLike).update(entityId, { status });

      const op = status ? '+' : '-';
      await manager.query(
        `update ${entityType} set like_count = like_count ${op} 1 where id = ${entityId}`,
      );
    });
    return null;
  }
}
