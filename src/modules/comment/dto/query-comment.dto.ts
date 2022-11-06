import { IntersectionType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { QueryPagerInputDto } from 'src/common/base.dto';

class QueryTopicCommentDto {
  @ApiProperty()
  @IsUUID()
  topicId: string;
}

export class QueryTopicCommentListDto extends IntersectionType(
  QueryPagerInputDto,
  QueryTopicCommentDto,
) {}

class QuerySubCommentDto {
  @IsUUID()
  commentId: string;
}
export class QuerySubCommentListDto extends IntersectionType(
  QueryPagerInputDto,
  QuerySubCommentDto,
) {}
