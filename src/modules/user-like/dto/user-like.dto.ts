import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';

export class UserLikeOperateDto {
  @ApiProperty({ description: '实体类型' })
  @IsString()
  entityId: string;

  @ApiProperty({ description: '操作类型，0:取消点赞， 1:点赞' })
  @IsIn([0, 1], { message: '类型只能为0或者1的数字' })
  @IsNumber()
  status: number;
}
