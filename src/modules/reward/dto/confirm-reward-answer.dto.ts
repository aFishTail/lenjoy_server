import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ConfirmRewardAnswerDto {
  @ApiProperty({ description: '悬赏id' })
  @IsUUID()
  rewardId: string;

  @ApiProperty({ description: '悬赏id' })
  @IsUUID()
  rewardAnswerId: string;
}
