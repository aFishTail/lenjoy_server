import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateRewardDto } from './create-reward.dto';
import { IsUUID } from 'class-validator';

export class UpdateRewardDto extends PartialType(CreateRewardDto) {
  @ApiProperty()
  @IsUUID()
  id: string;
}
