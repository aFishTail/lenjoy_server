import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { IEntityTypeList } from 'src/common/constants';

export class CreateTopicCommentDto {
  @ApiProperty()
  @IsUUID()
  entityId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  content: string;
}
export class CreateCommentToCommentDto {
  @ApiProperty()
  @IsUUID()
  entityId: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  parentCommentId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(240)
  content: string;
}
