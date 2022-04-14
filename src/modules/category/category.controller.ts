import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  QueryCategoryDetailDto,
  QueryCategoryInputDto,
} from './dto/query-category.dto';
import { RemoveCategoryInputDto } from './dto/remove-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@ApiTags('分类')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Post('/list')
  @ApiResponse({ type: Category })
  findAll(@Body() payload: QueryCategoryInputDto) {
    return this.categoryService.findAll(payload);
  }

  @Post('/detail')
  findOne(@Body() payload: QueryCategoryDetailDto) {
    return this.categoryService.findOne(payload.id);
  }

  @ApiBody({ type: UpdateCategoryDto })
  @Post('/update')
  update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @Post('/delete')
  remove(@Body() payload: RemoveCategoryInputDto) {
    return this.categoryService.delete(payload.id);
  }
}
