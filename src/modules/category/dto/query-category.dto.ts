import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryCategoryInputDto {
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
