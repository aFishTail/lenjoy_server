import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class SetEmailDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class UpdateUserBasicDto {
  @ApiProperty({ description: '头像' })
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty({ description: '简介' })
  @IsString()
  @IsOptional()
  nickname: string;

  @ApiProperty({ description: '简介' })
  @IsString()
  @IsOptional()
  description: string;
}

export class UpdateUserPasswordDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  newPassword: string;
}
