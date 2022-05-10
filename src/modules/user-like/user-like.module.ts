import { Module } from '@nestjs/common';
import { UserLikeService } from './user-like.service';
import { UserLikeController } from './user-like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLike } from './entities/user-like.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserLike])],
  controllers: [UserLikeController],
  exports: [UserLikeService],
  providers: [UserLikeService],
})
export class UserLikeModule {}
