import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryPagerInputDto, ResponseDto } from 'src/common/base.dto';
import { User } from '../entities/user.entity';

export class QueryUserInputDto extends QueryPagerInputDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsOptional()
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
