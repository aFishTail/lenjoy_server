import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateTopicDto } from './create-resource.dto';

export class UpdateTopicDto extends PartialType(CreateTopicDto) {
  @ApiProperty()
  @IsUUID()
  id: string;
}
