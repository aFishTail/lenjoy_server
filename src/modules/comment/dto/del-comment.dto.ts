import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DelTopicCommentDto {
  @ApiProperty()
  @IsUUID()
  entityId: string;
}

export class DelCommentToCommentDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
