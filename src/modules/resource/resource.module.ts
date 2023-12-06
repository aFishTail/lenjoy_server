import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { CategoryModule } from '../category/category.module';
import { AuthModule } from '../auth/auth.module';
import { ScoreModule } from '../score/score.module';
import { ResourceAdminController } from './admin/resource-admin.controller';
import { ResourceAdminService } from './admin/resource-admin.service';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource, User]),
    CategoryModule,
    AuthModule,
    ScoreModule,
    UserModule,
  ],
  controllers: [ResourceController, ResourceAdminController],
  providers: [ResourceService, ResourceAdminService],
})
export class ResourceModule {}
