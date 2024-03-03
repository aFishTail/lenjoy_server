import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { AdminTopicController, TopicController } from './topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { CategoryModule } from 'src/modules/category/category.module';
import { AuthModule } from '../auth/auth.module';
import { ScoreModule } from '../score/score.module';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic, User]),
    CategoryModule,
    AuthModule,
    ScoreModule,
    UserModule,
  ],
  controllers: [TopicController, AdminTopicController],
  providers: [TopicService],
})
export class TopicModule {}
