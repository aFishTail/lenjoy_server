import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { RewardAdminService } from './admin/rewarAdmin.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { ScoreModule } from '../score/score.module';
import { Reward } from './entities/reward.entity';
import { RewardAnswer } from '../reward-answer/entities/reward-answer.entity';
import { RewardAdminController } from './admin/rewardAdmin.controller';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reward, User, RewardAnswer]),
    CategoryModule,
    AuthModule,
    ScoreModule,
  ],
  controllers: [RewardController, RewardAdminController],
  providers: [RewardService, RewardAdminService],
})
export class RewardModule {}
