import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  AdminCategoryController,
  CategoryController,
} from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  exports: [CategoryService],
  controllers: [CategoryController, AdminCategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
