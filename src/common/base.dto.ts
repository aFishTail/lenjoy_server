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

export class ResponseDto<T> {
  @ApiProperty()
  data: T;
  @ApiProperty()
  message: string;
  @ApiProperty()
  code: 200 | 500 | 401;
}

export class QueryDetailDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
