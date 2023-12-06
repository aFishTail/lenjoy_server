import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminUserController, UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThirdAccount, User } from './entities/user.entity';
import { EmailModule } from '../email/email.module';
import { UserBehavior } from './entities/user-behavior.entity';
import { ScoreModule } from '../score/score.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ThirdAccount, UserBehavior]),
    EmailModule,
    ScoreModule,
  ],
  controllers: [UserController, AdminUserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
