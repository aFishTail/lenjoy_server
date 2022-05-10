import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { CategoryModule } from 'src/modules/category/category.module';
import { AuthModule } from '../auth/auth.module';
import { ScoreModule } from '../score/score.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic]),
    CategoryModule,
    AuthModule,
    ScoreModule,
  ],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
