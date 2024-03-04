import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import {
  QueryPagerInputDto,
  QueryPagerOutDto,
  ResponseDto,
} from 'src/common/base.dto';
import { Reward } from '../entities/reward.entity';

export class QueryRewardDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryLabel?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  endTime?: string;
}

export class QueryRewardListInputDto extends IntersectionType(
  QueryPagerInputDto,
  QueryRewardDto,
) {}

export class QueryRewardListOut extends QueryPagerOutDto<Reward> {
  @ApiProperty({ type: Reward, isArray: true })
  records: Reward[];
}
export class QueryRewardListOutDto extends ResponseDto {
  @ApiProperty({ type: QueryRewardListOut, isArray: true })
  data: unknown;
}
