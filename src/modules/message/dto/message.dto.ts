import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class MessageMarkReadDto {
  @ApiProperty({ description: '消息主键id, 不传设置所有' })
  @IsOptional()
  @IsUUID()
  id?: string;
}
