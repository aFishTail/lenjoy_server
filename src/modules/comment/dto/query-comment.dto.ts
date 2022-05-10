import { IntersectionType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';
import { QueryPagerInputDto } from 'src/common/base.dto';

class QueryTopicCommentDto {
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
