import { IntersectionType } from '@nestjs/mapped-types';
import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { QueryPagerInputDto } from 'src/common/base.dto';
import { Topic } from '../entities/topic.entity';

export class QueryTopicDto {
  @IsOptional()
  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  categoryLabel: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  startTime: string;

  @IsString()
  @IsOptional()
  endTime: string;
}

export class QueryTopicListDto extends IntersectionType(
  QueryPagerInputDto,
  QueryTopicDto,
) {}

export class QueryTopicOutDto {
  records: Topic[];
  total: number;
}
