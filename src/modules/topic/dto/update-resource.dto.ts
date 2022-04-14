import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTopicDto } from './create-resource.dto';

export class UpdateTopicDto {
  @ApiProperty({ description: 'id' })
  id: string;
  @ApiProperty({ description: '分类id' })
  categoryId?: string;

  @ApiProperty({ description: '标题' })
  title?: string;

  @ApiProperty({ description: '内容' })
  content?: string;
}
