import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { QueryPagerOutDto } from 'src/common/base.dto';
import { Resource } from '../entities/resource.entity';

export class QueryResourceDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isWithPermission?: boolean;
}

export class QueryResourceOut extends QueryPagerOutDto<Resource> {
  @ApiProperty({ type: Resource, isArray: true })
  records: Resource[];
}