import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsNumber, Max, Min } from 'class-validator';
import { IEntityTypeList } from 'src/common/constants';
import { ScoreOperateType } from '../entities/score.entity';

export class ScoreOperateDto {
  @ApiProperty({ description: '实体id' })
  @IsString()
  entityId: string;

  @ApiProperty({ description: '实体类型' })
  @IsString()
  @IsIn(IEntityTypeList, { message: '请传入正确的实体类型' })
  entityType: string;

  @ApiProperty({ description: '操作类型，0:减少， 1:增加' })
  @IsIn([ScoreOperateType.DECREASE, ScoreOperateType.INCREASE], {
    message: '类型只能为0或者1的数字',
  })
  type: ScoreOperateType;
}
