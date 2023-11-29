import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateRewardDto {
  @ApiProperty({ description: '悬赏积分' })
  @IsNumber()
  @IsNotEmpty()
  score: number;

  @ApiProperty({ description: '是否公开悬赏结果' })
  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  @ApiProperty({ description: '标题' })
  @IsString()
  @MaxLength(32, { message: '帖子标题最长不可以超过32位字符' })
  title: string;

  @ApiProperty({ description: '内容' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '主题' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
