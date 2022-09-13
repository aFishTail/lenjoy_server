import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger';
import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  QueryPagerInputDto,
  QueryPagerOutDto,
  ResponseDto,
} from 'src/common/base.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { Topic } from '../entities/topic.entity';

export class QueryTopicDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryLabel?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  startTime?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  endTime?: string;
}

export class QueryTopicListInputDto extends IntersectionType(
  QueryPagerInputDto,
  QueryTopicDto,
) {}

// 当前访问的用户
class VisitedUser {
  @ApiProperty()
  id: string;
  @ApiProperty()
  username: string;
}

// 关联上当前访问topic的用户
class UserVisitedTopicDto extends Topic {
  @ApiProperty({
    type: VisitedUser,
  })
  user: string;
}

export class QueryTopicListOut extends QueryPagerOutDto<UserVisitedTopicDto> {
  @ApiProperty({ type: UserVisitedTopicDto, isArray: true })
  records: UserVisitedTopicDto[];
}
export class QueryTopicListOutDto extends ResponseDto {
  @ApiProperty({ type: QueryTopicListOut, isArray: true })
  data: unknown;
}

// TODO: test
// export class QueryTopicListOutDto extends ResponseDto {
//   @ApiProperty({
//     type: 'array',
//     items: {
//       type: 'object',
//       items: {

//       }
//     }
//   })
//   data: unknown;
// }
