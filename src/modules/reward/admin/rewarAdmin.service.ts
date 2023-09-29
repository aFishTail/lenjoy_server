import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScoreService } from 'src/modules/score/score.service';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import { Reward } from '../entities/reward.entity';
import { QueryRewardListInputDto } from '../dto/query-reward.dto';
import { ADMIN_USER_ID, ScoreOperateType } from 'src/modules/score/score.type';
import { EntityTypeEnum } from 'src/common/constants';

@Injectable()
export class RewardAdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
    private readonly scoreService: ScoreService,
  ) {}

  async findAll(payload: QueryRewardListInputDto) {
    const { title, pageNum, pageSize } = payload;
    const qb = this.rewardRepository
      .createQueryBuilder('reward')
      .leftJoinAndSelect('reward.postUser', 'user')
      .leftJoinAndSelect('reward.rewardUser', 'user')
      .orderBy('reward.create_at', 'DESC');
    if (title) {
      qb.andWhere('reward.title LIKE :title', { title: `%${title}%` });
    }
    qb.limit(pageSize).offset((pageNum - 1) * pageSize);
    const [records, total] = await qb.getManyAndCount();
    const data = {
      records,
      total,
    };
    return data;
  }

  async findOne(id: string) {
    const qb = this.rewardRepository
      .createQueryBuilder('reward')
      .leftJoinAndSelect('reward.postUser', 'user')
      .leftJoinAndSelect('reward.rewardUser', 'user')
      .where({ id });
    const reward = await qb.getOne();
    return reward;
  }

  async remove(id: string) {
    // TODO: 这里的事务并不完整， scoreService启动了另一个事务
    const reward = await this.rewardRepository.findOneBy({ id });
    await this.rewardRepository.remove(reward);
    await this.scoreService.operate(
      ADMIN_USER_ID,
      {
        type: ScoreOperateType.DECREASE,
        score: reward.score,
      },
      reward.id,
      EntityTypeEnum.Reward,
    );
    return null;
  }
}
