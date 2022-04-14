import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { QueryPagerInputDto, QueryPagerOutDto } from 'src/common/base.dto';
import { User } from '../entities/user.entity';

export class QueryUserInputDto extends QueryPagerInputDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  startTime: string;
  @ApiProperty()
  endTime: string;

  //   @IsNumber()
  //   pageNum: number;

  //   @IsNumber()
  //   pageSize: number;
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
