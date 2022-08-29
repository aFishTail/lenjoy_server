import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryTopicDetailInputDto } from 'src/common/base.dto';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryInputDto } from './dto/query-category.dto';
import { RemoveCategoryInputDto } from './dto/remove-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@ApiTags('分类')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/list')
  @ApiOperation({ summary: '获取分类列表' })
  @ApiResponse({ type: Category })
  findAll(@Body() payload: QueryCategoryInputDto) {
    return this.categoryService.findAll(payload);
  }

  @ApiOperation({ summary: '新增' })
  @Post('/create')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }
}

@ApiTags('管理平台-分类')
@UseGuards(RolesGuard)
@Controller('admin/category')
export class AdminCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: '新增' })
  @Roles('admin')
  @Post('/create')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: '查询列表' })
  @Roles('admin')
  @Post('/list')
  @ApiResponse({ type: Category })
  findAll(@Body() payload: QueryCategoryInputDto) {
    return this.categoryService.findAll(payload);
  }

  @ApiOperation({ summary: '查询详情' })
  @Roles('admin')
  @Post('/detail')
  findOne(@Body() payload: QueryTopicDetailInputDto) {
    return this.categoryService.findOne(payload.id);
  }

  @ApiOperation({ summary: '编辑' })
  @ApiBody({ type: UpdateCategoryDto })
  @Roles('admin')
  @Post('/update')
  update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @ApiOperation({ summary: '删除' })
  @Roles('admin')
  @Post('/delete')
  remove(@Body() payload: RemoveCategoryInputDto) {
    return this.categoryService.delete(payload.id);
  }
}
