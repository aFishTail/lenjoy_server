import { ScoreOperateType } from './../score/score.type';
import { ScoreService } from './../score/score.service';
import { Injectable } from '@nestjs/common';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Reward } from './entities/reward.entity';
import { EntityTypeEnum } from 'src/common/constants';
import { QueryRewardListInputDto } from './dto/query-reward.dto';
import { getChangeInfo } from '../score/score.util';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
    private readonly scoreService: ScoreService,
    private dataSource: DataSource,
  ) {}
  async create(createRewardDto: CreateRewardDto, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    await this.dataSource.transaction(async (manager) => {
      const reward = await this.rewardRepository.create({
        ...createRewardDto,
        postUser: user,
      });
      const savedReward = await this.rewardRepository.save(reward);
      await this.scoreService.operate(
        userId,
        { type: ScoreOperateType.DECREASE, score: createRewardDto.score },
        savedReward.id,
        EntityTypeEnum.Reward,
      );
    });
  }

  async findAll(payload: QueryRewardListInputDto, userId?: string) {
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

  async findOne(id: string, userId?: string) {
    const qb = this.rewardRepository
      .createQueryBuilder('reward')
      .leftJoinAndSelect('reward.postUser', 'user')
      .leftJoinAndSelect('reward.rewardUser', 'user')
      .where({ id });
    const reward = await qb.getOne();
    return reward;
  }

  // TODO: update score，积分变化
  async update(updateRewardDto: UpdateRewardDto, userId: string) {
    const { id, title, content } = updateRewardDto;
    const oldReward = await this.rewardRepository.findOne({
      where: { id },
    });
    const newReward = {
      ...oldReward,
      title,
      content,
    };
    const updatedReward = this.rewardRepository.merge(oldReward, newReward);
    // TODO: 这里的事务并不完整， scoreService启动了另一个事务
    this.dataSource.transaction(async (manager) => {
      await manager.getRepository(Reward).save(updatedReward);
      if (updatedReward.score !== oldReward.score) {
        const { type, score } = getChangeInfo(
          updatedReward.score,
          oldReward.score,
        );
        await this.scoreService.operate(
          userId,
          { type, score, desc: '更新悬赏' },
          updatedReward.id,
          EntityTypeEnum.Reward,
        );
      }
    });
  }

  async remove(id: string, userId: string) {
    // TODO: 这里的事务并不完整， scoreService启动了另一个事务
    await this.dataSource.transaction(async (manager) => {
      const rewardRepository = manager.getRepository(Reward);
      const reward = await rewardRepository.findOneBy({ id });
      await rewardRepository.remove(reward);
      await this.scoreService.operate(
        userId,
        {
          type: ScoreOperateType.DECREASE,
          score: reward.score,
        },
        reward.id,
        EntityTypeEnum.Reward,
      );
    });
    return null;
  }
}
