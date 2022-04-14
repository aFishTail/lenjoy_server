import { ApiProperty } from '@nestjs/swagger';

export class QueryCategoryInputDto {
  @ApiProperty({ description: '名称' })
  name: string;
  @ApiProperty()
  startTime: string;
  @ApiProperty()
  endTime: string;
}

export class QueryCategoryDetailDto {
  @ApiProperty()
  id: string;
}
