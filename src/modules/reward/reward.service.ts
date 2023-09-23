import { Injectable } from '@nestjs/common';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Reward } from './entities/reward.entity';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
  ) {}
  async create(createRewardDto: CreateRewardDto, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const reward = await this.rewardRepository.create({
      ...createRewardDto,
      postUser: user,
    });
    return await this.rewardRepository.save(reward);
  }

  findAll() {
    return `This action returns all reward`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reward`;
  }

  update(id: number, updateRewardDto: UpdateRewardDto) {
    return `This action updates a #${id} reward`;
  }

  remove(id: number) {
    return `This action removes a #${id} reward`;
  }
}
