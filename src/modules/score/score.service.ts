import { EntityTypeEnum } from 'src/common/constants';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Score } from './entities/score.entity';
import { ScoreOperateOption, ScoreOperateType } from './score.type';
import { getOpScoreAndDesc } from './score.util';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async operate(
    userId: string,
    typeOption: ScoreOperateType | ScoreOperateOption,
    entityId: string,
    entityType: EntityTypeEnum,
  ) {
    const { score, type, desc } = getOpScoreAndDesc(typeOption, entityType);
    await this.dataSource.transaction(async (manager) => {
      const scoreEntity = await manager.getRepository(Score).create({
        userId,
        entityId,
        entityType,
        score,
        type,
        description: desc,
      });
      await manager.getRepository(Score).save(scoreEntity);
      await manager
        .createQueryBuilder()
        .update(User)
        .where({ id: userId })
        .set({
          score: () =>
            `score ${type === ScoreOperateType.INCREASE ? '+' : '-'} ${score}`,
        })
        .execute();
    });
    return null;
  }

  async list(userId: string) {
    const [records, total] = await this.scoreRepository.findAndCount({
      where: { userId },
    });
    return { records, total };
  }
  async rank() {
    const data = await this.userRepository.find({
      select: [
        'id',
        'username',
        'score',
        'avatar',
        'topicCount',
        'commentCount',
      ],
      order: {
        score: 'DESC',
      },
      take: 10,
    });
    return data.map((e) => {
      const { id, username, score, avatar, topicCount, commentCount } = e;
      return {
        userId: id,
        username,
        avatar,
        topicCount,
        commentCount,
        score,
      };
    });
  }
}
