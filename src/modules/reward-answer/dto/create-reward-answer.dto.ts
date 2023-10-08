import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRewardAnswerDto {
  @ApiProperty({ description: '悬赏回答内容' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '悬赏id' })
  @IsUUID()
  rewardId: string;
}
