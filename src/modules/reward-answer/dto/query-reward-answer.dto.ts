import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class QueryRewardAnswerDto {
  @ApiProperty({ description: '悬赏id' })
  @IsUUID()
  rewardId: string;
}
