import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRewardAnswerDto } from './create-reward-answer.dto';
import { IsUUID } from 'class-validator';

export class UpdateRewardAnswerDto extends PartialType(CreateRewardAnswerDto) {
  @ApiProperty()
  @IsUUID()
  id: string;
}
