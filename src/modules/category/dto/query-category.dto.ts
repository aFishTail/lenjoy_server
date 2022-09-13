import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ResponseDto } from 'src/common/base.dto';
import { Category } from '../entities/category.entity';

export class QueryCategoryListInputDto {
  @ApiProperty({ description: '分类名称' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  startTime: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  endTime: string;
}
export class QueryCategoryListOutDto extends ResponseDto {
  @ApiProperty({ type: Category, isArray: true })
  data: unknown;
}
export class QueryCategoryDetailOutDto extends ResponseDto {
  @ApiProperty({ type: Category })
  data: unknown;
}
