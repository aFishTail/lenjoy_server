import { Module } from '@nestjs/common';
import { RewardAnswerService } from './reward-answer.service';
import { RewardAnswerController } from './reward-answer.controller';
import { RewardAnswer } from './entities/reward-answer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reward } from '../reward/entities/reward.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RewardAnswer, Reward])],
  controllers: [RewardAnswerController],
  providers: [RewardAnswerService],
})
export class RewardAnswerModule {}
