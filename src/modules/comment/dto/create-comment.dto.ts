import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  IsIn,
} from 'class-validator';

export class CreateTopicCommentDto {
  @ApiProperty()
  @IsString()
  entityId: string;

  @ApiProperty()
  @IsIn(['topic', 'resource', 'reward'])
  entityType: string;

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
