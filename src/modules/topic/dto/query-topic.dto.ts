import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Topic } from '../entities/topic.entity';

interface Pager {
  pageSize: number;
  pageNum: number;
}
export class QueryTopicDto implements Pager {
  //   @IsString()
  //   @IsEmpty()
  //TODO: 校验参数可传可不传
  @IsOptional()
  userId: string;

  categoryId: string;

  @IsNumber()
  pageNum: number;

  @IsNumber()
  pageSize: number;

  title: string;

  startTime: string;
  endTime: string;
}

export class QueryTopicOutDto {
  records: Topic[];
  total: number;
}

