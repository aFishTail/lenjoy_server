import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { CategoryModule } from '../category/category.module';
import { AuthModule } from '../auth/auth.module';
import { ScoreModule } from '../score/score.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource]),
    CategoryModule,
    AuthModule,
    ScoreModule,
  ],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
