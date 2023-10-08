import { Controller, Post, Body } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ApiTags } from '@nestjs/swagger';
import { ScoreOperateDto } from './dto/score.dto';
import { QueryUser } from 'src/decorators/user.decorator';

@ApiTags('积分流水')
@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post('/operate')
  create(@Body() payload: ScoreOperateDto, @QueryUser('id') userId) {
    const { type, entityId, entityType } = payload;
    return this.scoreService.operate(userId, type, entityId, entityType);
  }

  @Post('/list')
  list(@QueryUser('id') userId) {
    return this.scoreService.list(userId);
  }
  @Post('/rank')
  rank() {
    return this.scoreService.rank();
  }
}
