import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRewardAnswerDto } from './dto/create-reward-answer.dto';
import { UpdateRewardAnswerDto } from './dto/update-reward-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RewardAnswer } from './entities/reward-answer.entity';
import { User } from '../user/entities/user.entity';
import { QueryRewardAnswerDto } from './dto/query-reward-answer.dto';

@Injectable()
export class RewardAnswerService {
  constructor(
    @InjectRepository(RewardAnswer)
    private readonly rewardAnswerRepository: Repository<RewardAnswer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createRewardAnswerDto: CreateRewardAnswerDto, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const rewardAnswer = this.rewardAnswerRepository.create({
      ...createRewardAnswerDto,
      answerUser: user,
    });
    return await this.rewardAnswerRepository.save(rewardAnswer);
  }

  async findAll(queryRewardAnswerDto: QueryRewardAnswerDto) {
    const { rewardId } = queryRewardAnswerDto;
    const [records, total] = await this.rewardAnswerRepository
      .createQueryBuilder('rewardAnswer')
      .where('rewardAnswer.rewardId = : rewardId', { rewardId })
      .getManyAndCount();
    return {
      records,
      total,
    };
  }

  async update(updateRewardAnswerDto: UpdateRewardAnswerDto) {
    const { content, id } = updateRewardAnswerDto;
    const oldOne = this.rewardAnswerRepository.findOneBy({ id });
    if (!oldOne) {
      throw new BadRequestException('悬赏回答不存在');
    }
    await this.rewardAnswerRepository
      .createQueryBuilder()
      .update(RewardAnswer)
      .set({
        content,
      })
      .where('id= :id', { id })
      .execute();
  }

  async remove(id: string) {
    // TODO: 确认为最终答案的不可以删除
    await this.rewardAnswerRepository.delete(id);
  }
}
