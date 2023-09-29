import { ResponseDto } from 'src/common/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Reward } from '../entities/reward.entity';

export class QueryRewardDetailOutDto extends ResponseDto {
  @ApiProperty({ type: Reward })
  data: unknown;
}
