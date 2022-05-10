import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { QueryPagerInputDto } from 'src/common/base.dto';
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
