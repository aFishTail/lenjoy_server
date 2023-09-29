import { ResponseDto } from 'src/common/base.dto';
import { Topic } from '../entities/topic.entity';
import { ApiProperty } from '@nestjs/swagger';

export class QueryTopicDetailOutDto extends ResponseDto {
  @ApiProperty({ type: Topic })
  data: unknown;
}
