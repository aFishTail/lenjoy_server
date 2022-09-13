import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: '分类名称' })
  @MaxLength(10)
  name: string;

  @ApiProperty({ description: '分类标签' })
  @MaxLength(10)
  label: string;

  @ApiProperty({ description: '分类描述' })
  @IsOptional()
  @MaxLength(200)
  description: string;

  @ApiProperty({ description: '图标' })
  @IsOptional()
  @MaxLength(200)
  logo: string;
}
