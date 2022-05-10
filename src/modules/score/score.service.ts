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
  ) {}
  async operate(
    userId: string,
    type: 0 | 1,
    entityId: string,
    entityType: string,
  ) {
    const { score, desc } = getOpScoreAndDesc(type, entityType);
    await getManager().transaction(async (mannger) => {
      await mannger.getRepository(Score).create({
        userId,
        entityId,
        entityType,
        score,
        description: desc,
      });
      await mannger
        .createQueryBuilder()
        .update(User)
        .set({ score: () => `score ${type ? '+' : '-'} ${score}` });
    });
    return null;
  }

  async list(userId: string) {
    const [records, total] = await this.scoreRepository.findAndCount({
      where: { userId },
    });
    return { records, total };
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
