import { ScoreConfig, ScoreOperateType } from './../score/score.type';
import { ScoreService } from './../score/score.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Reward } from './entities/reward.entity';
import { EntityTypeEnum } from 'src/common/constants';
import { QueryRewardListInputDto } from './dto/query-reward.dto';
import { getChangeInfo } from '../score/score.util';
import { ConfirmRewardAnswerDto } from './dto/confirm-reward-answer.dto';
import { RewardAnswer } from '../reward-answer/entities/reward-answer.entity';
import { floor } from 'lodash';
import { CategoryService } from '../category/category.service';
import { UserLike } from '../user-like/entities/user-like.entity';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
    @InjectRepository(RewardAnswer)
    private readonly rewardAnswerRepository: Repository<RewardAnswer>,
    private readonly scoreService: ScoreService,
    private readonly categoryService: CategoryService,
    private dataSource: DataSource,
  ) {}
  async create(createRewardDto: CreateRewardDto, userId: string) {
    const { score } = createRewardDto;
    const category = await this.categoryService.findById(
      createRewardDto.categoryId,
    );
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user.score < score) {
      throw new BadRequestException(`积分不足${score}，无法发布悬赏`);
    }
    return await this.dataSource.transaction(async (manager) => {
      const reward = await manager.getRepository(Reward).create({
        ...createRewardDto,
        category,
        user: user,
      });
      const savedReward = await manager.getRepository(Reward).save(reward);
      await this.scoreService.operateWithTransaction(
        manager,
        userId,
        {
          type: ScoreOperateType.DECREASE,
          score: createRewardDto.score,
          desc: '发布悬赏',
        },
        savedReward.id,
        EntityTypeEnum.Reward,
      );
      return reward;
    });
  }

  async findAll(payload: QueryRewardListInputDto, userId?: string) {
    const { title, pageNum, pageSize, categoryLabel } = payload;
    const qb = this.rewardRepository
      .createQueryBuilder('reward')
      .leftJoinAndSelect('reward.category', 'category')
      .leftJoinAndSelect('reward.user', 'user')
      .leftJoinAndSelect('reward.rewardUser', 'rewardUser')
      .leftJoinAndSelect('reward.rewardAnswers', 'rewardAnswer')
      .leftJoinAndSelect(
        'reward.confirmedRewardAnswer',
        'confirmedRewardAnswer',
      )
      .orderBy('reward.create_at', 'DESC');
    if (title) {
      qb.andWhere('reward.title LIKE :title', { title: `%${title}%` });
    }
    if (categoryLabel) {
      qb.andWhere('category.label = :label', { label: categoryLabel });
    }
    qb.andWhere('reward.status != :status', { status: 'cancel' });
    qb.limit(pageSize).offset((pageNum - 1) * pageSize);
    const [records, total] = await qb.getManyAndCount();
    const result = [];
    for (let i = 0; i < records.length; i++) {
      const n = { ...records[i], isLike: 0 };
      let like;
      if (userId) {
        like = await this.dataSource
          .getRepository(UserLike)
          .findOne({ where: { userId, entityId: n.id } });
      }
      if (like) {
        n.isLike = like.status;
      }
      result.push(n);
    }
    return {
      records: result,
      total,
    };
  }

  async findOne(id: string, userId: string) {
    const reward = await this.rewardRepository
      .createQueryBuilder('reward')
      .leftJoinAndSelect('reward.category', 'category')
      .leftJoinAndSelect('reward.user', 'user')
      .leftJoinAndSelect('reward.rewardUser', 'rewardUser')
      .leftJoinAndSelect('reward.rewardAnswers', 'rewardAnswer')
      .leftJoinAndSelect(
        'reward.confirmedRewardAnswer',
        'confirmedRewardAnswer',
      )
      .where({ id })
      .getOne();
    const like = await this.dataSource.getRepository(UserLike).findOne({
      where: {
        userId,
        entityId: reward.id,
        entityType: EntityTypeEnum.Reward,
      },
    });
    return { ...reward, isLike: like?.status ?? 0 };
  }

  // TODO: update score，积分变化
  async update(updateRewardDto: UpdateRewardDto, userId: string) {
    const { id, title, content, categoryId } = updateRewardDto;
    const oldReward = await this.rewardRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    const newReward = {
      ...oldReward,
      title,
      content,
    };
    if (categoryId && categoryId !== oldReward.category.id) {
      newReward.category = await this.categoryService.findById(categoryId);
      if (!newReward.category) {
        throw new BadRequestException('该分类不存在');
      }
    }
    const updatedReward = this.rewardRepository.merge(oldReward, newReward);
    // TODO: 这里的事务并不完整， scoreService启动了另一个事务
    this.dataSource.transaction(async (manager) => {
      await manager.getRepository(Reward).save(updatedReward);
      if (updatedReward.score !== oldReward.score) {
        const { type, score } = getChangeInfo(
          updatedReward.score,
          oldReward.score,
        );
        await this.scoreService.operateWithTransaction(
          manager,
          userId,
          { type, score, desc: '更新悬赏' },
          updatedReward.id,
          EntityTypeEnum.Reward,
        );
      }
    });
  }

  async canncel(id: string, userId: string) {
    await this.dataSource.transaction(async (manager) => {
      const rewardRepository = manager.getRepository(Reward);
      const reward = await rewardRepository.findOneBy({ id });
      reward.status = 'cancel';
      reward.cancelType = 'user';
      await rewardRepository.save(reward);
      await this.setUserCompeleteRate(manager, userId);
      await this.scoreService.operateWithTransaction(
        manager,
        userId,
        {
          type: ScoreOperateType.INCREASE,
          score: reward.score,
          desc: '用户删除(取消)悬赏',
        },
        reward.id,
        EntityTypeEnum.Reward,
      );
    });
    return null;
  }

  /**
   * 确认某个回答为悬赏答案
   */
  async confirm(
    confirmRewardAnswerDto: ConfirmRewardAnswerDto,
    userId: string,
  ) {
    const { rewardId, rewardAnswerId } = confirmRewardAnswerDto;
    const reward = await this.rewardRepository.findOneBy({ id: rewardId });
    const rewardAnswer = await this.rewardAnswerRepository.findOne({
      where: { id: rewardAnswerId },
      relations: ['user'],
    });
    if (!reward) {
      throw new BadRequestException('悬赏帖子不存在');
    }
    if (!rewardAnswer) {
      throw new BadRequestException('悬赏回答不存在');
    }
    if (reward.confirmedRewardAnswer) {
      throw new BadRequestException('该悬赏已确认答案');
    }
    await this.dataSource.manager.transaction(async (manager) => {
      reward.confirmedRewardAnswer = rewardAnswer;
      reward.status = 'finish';
      reward.cancelType = 'admin';
      await this.setUserCompeleteRate(manager, userId);
      await manager.getRepository(Reward).save(reward);
      rewardAnswer.isConfirmedAnswer = true;
      await manager.getRepository(RewardAnswer).save(rewardAnswer);
      // TODO: 积分操作
      await this.scoreService.operateWithTransaction(
        manager,
        rewardAnswer.user.id,
        {
          type: ScoreOperateType.INCREASE,
          score: reward.score * (1 - ScoreConfig.PlatformChargeRatio),
          desc: '被选为悬赏正确答案',
        },
        reward.id,
        EntityTypeEnum.Reward,
      );
    });
  }

  async setUserCompeleteRate(manager: EntityManager, userId: string) {
    const user = await manager.getRepository(User).findOneBy({ id: userId });
    const userRewards = await manager
      .getRepository(Reward)
      .createQueryBuilder('reward')
      .where('reward.status IN (:...names)', { name: ['finish', 'cancel'] })
      .where('reward.user = :userId', { userId })
      .getMany();
    const compeleteRate = floor(
      userRewards.filter((r) => r.cancelType === 'user').length /
        userRewards.length,
      4,
    );
    user.compeleteRate = compeleteRate;
    manager.getRepository(User).save(user);
  }

  async incrViewCount(id: string) {
    return this.rewardRepository
      .createQueryBuilder()
      .update(Reward)
      .set({
        viewCount: () => 'view_count + 1',
      })
      .where('id = :id', { id })
      .execute();
  }
}
