import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { ScoreOperateDto } from './dto/score.dto';
import { Score } from './entities/score.entity';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async operate(
    userId: string,
    type: 0 | 1,
    entityId: string,
    entityType: string,
  ) {
    const { score, desc } = getOpScoreAndDesc(type, entityType);
    await getManager().transaction(async (manager) => {
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
        .set({ score: () => `score ${type ? '+' : '-'} ${score}` })
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

// 获取操作类型的积分
function getOpScoreAndDesc(type, entityType) {
  let score = 0;
  let desc = '';
  switch (entityType) {
    case 'topic':
      score = 5;
      desc = `${type ? '发布' : '删除'}帖子`;
      break;

    default:
      break;
  }
  return { score, desc };
}
