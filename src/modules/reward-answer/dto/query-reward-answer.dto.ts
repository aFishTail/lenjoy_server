import { IntersectionType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { QueryPagerInputDto } from 'src/common/base.dto';

export class QueryRewardAnswerDto {
  @ApiProperty({ description: '悬赏id' })
  @IsUUID()
  rewardId: string;
}

export class QueryRewardListInputDto extends IntersectionType(
  QueryRewardAnswerDto,
  QueryPagerInputDto,
) {}