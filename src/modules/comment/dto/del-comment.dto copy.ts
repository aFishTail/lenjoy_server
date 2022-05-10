import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsUUID, MaxLength } from 'class-validator';
import { IEntityTypeList } from 'src/common/constants';

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
