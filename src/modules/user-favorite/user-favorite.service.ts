import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserFavoriteOperateDto } from './dto/user-favorite.dto';
import { UserFavorite } from './entities/user-favorite.entity';

@Injectable()
export class UserFavoriteService {
  constructor(
    @InjectRepository(UserFavorite)
    private userFavoriteRepository: Repository<UserFavorite>,
    private dataSource: DataSource,
  ) {}

  async operate(userId, p: UserFavoriteOperateDto & { entityType: string }) {
    const { entityId, status, entityType } = p;
    const oldRecord = await this.userFavoriteRepository.findOne({
      where: { userId },
    });

    if (!oldRecord) {
      await this.dataSource.transaction(async (manager) => {
        const _repository = manager.getRepository(UserFavorite);
        const newRecord = await _repository.create({
          userId,
          entityType,
          entityId,
          status: 1,
        });
        await _repository.save(newRecord);

        await manager.query(
          `update ${entityType} set like_count = like_count + 1 where id = ${entityId}`,
        );
      });
      return null;
    }

    if (status === oldRecord.status) {
      throw new HttpException(
        `操作错误，不可重复${status === 1 ? '收藏' : '取消收藏'}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(UserFavorite).update(entityId, { status });
      const op = status ? '+' : '-';
      await manager.query(
        `update ${entityType} set favorite_count = favorite_count ${op} 1 where id = ${entityId}`,
      );
    });
    return null;
  }
}
