import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateResourceDto {
  @ApiProperty({ description: '资源名称' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: '资源名次最长不可以超过255位字符' })
  name: string;

  @ApiProperty({ description: '链接' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: '链接最长不可以超过255位字符' })
  url: string;

  @ApiProperty({ description: '是否加密' })
  @IsBoolean()
  haveCode: boolean;

  @ApiProperty({ description: '链接密码' })
  @IsString()
  @IsOptional()
  @MaxLength(20, { message: '链接密码最长不可以超过20位字符' })
  code: string;

  @ApiProperty({ description: '是否公开' })
  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  @ApiProperty({ description: '资源需要的积分' })
  @IsNumber()
  @IsOptional()
  score: number;

  @ApiProperty({ description: '主题' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
