import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  @MaxLength(32, { message: '帖子标题最长不可以超过32位字符' })
  title: string;

  @ApiProperty({ description: '内容' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '摘要' })
  @IsString()
  @IsOptional()
  summary: string;

  @ApiProperty({ description: '帖子主题' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
