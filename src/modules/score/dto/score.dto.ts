import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsNumber, Max, Min } from 'class-validator';
import { IEntityTypeList } from 'src/common/constants';

export class ScoreOperateDto {
  @ApiProperty({ description: '实体id' })
  @IsString()
  entityId: string;

  @ApiProperty({ description: '实体类型' })
  @IsString()
  @IsIn(IEntityTypeList, { message: '请传入正确的实体类型' })
  entityType: string;

  @ApiProperty({ description: '操作类型，0:减少， 1:增加' })
  @IsIn([0, 1], { message: '类型只能为0或者1的数字' })
  @IsNumber()
  type: 0 | 1;
}
