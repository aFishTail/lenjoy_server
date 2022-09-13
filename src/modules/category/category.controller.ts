import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrimaryKeyDto, ResponseDto } from 'src/common/base.dto';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  QueryCategoryDetailOutDto,
  QueryCategoryListInputDto,
  QueryCategoryListOutDto,
} from './dto/query-category.dto';
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
  findAll(@Body() payload: QueryCategoryListInputDto) {
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
  @ApiResponse({ type: ResponseDto })
  @Roles('admin')
  @Post('/create')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: '查询列表' })
  @ApiResponse({ type: QueryCategoryListOutDto })
  @Roles('admin')
  @Post('/list')
  findAll(@Body() payload: QueryCategoryListInputDto) {
    return this.categoryService.findAll(payload);
  }

  @ApiOperation({ summary: '查询详情' })
  @ApiResponse({ type: QueryCategoryDetailOutDto })
  @Roles('admin')
  @Post('/detail')
  findOne(@Body() payload: PrimaryKeyDto) {
    return this.categoryService.findOne(payload.id);
  }

  @ApiOperation({ summary: '编辑' })
  @ApiResponse({ type: ResponseDto })
  @Roles('admin')
  @Post('/update')
  update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @ApiOperation({ summary: '删除' })
  @ApiResponse({ type: ResponseDto })
  @Roles('admin')
  @Post('/delete')
  remove(@Body() payload: PrimaryKeyDto) {
    return this.categoryService.delete(payload.id);
  }
}
