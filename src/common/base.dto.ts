import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class QueryPagerInputDto {
  @ApiProperty()
  @IsNumber()
  pageNum: number;

  @ApiProperty()
  @IsNumber()
  pageSize: number;
}

export class QueryPagerOutDto<T> {
  @ApiProperty()
  records: T[];
  @ApiProperty()
  total: number;
}

export class ResponseDto {
  @ApiProperty({ default: null })
  data: unknown;

  @ApiProperty({ example: '' })
  message: string;

  @ApiProperty({ description: '请求码', example: 201 })
  code: number;
}

export class PrimaryKeyDto {
  @ApiProperty({ description: '主键id' })
  @IsUUID()
  id: string;
}
