import { PartialType } from '@nestjs/swagger';
import { CreateTopicCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateTopicCommentDto) {}
