import { ApiExtraModels, ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { QueryPagerInputDto, ResponseDto } from 'src/common/base.dto';
import { User } from '../entities/user.entity';

export class QueryUserInputDto extends QueryPagerInputDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsString()
  endTime: string;
}

// export class QueryUserOutDto extends QueryPagerOutDto<User> {}
@ApiExtraModels(User)
export class QueryUserOutDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
    },
  })
  records: User[];
  @ApiProperty()
  total: number;
}

export class QueryUserDetailOutDto extends ResponseDto {
  @ApiProperty({ type: User })
  data: unknown;
}
