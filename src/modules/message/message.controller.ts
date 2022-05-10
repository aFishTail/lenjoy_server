import { Controller, Injectable, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { QueryUser } from 'src/decorators/user.decorator';
import { MessageMarkReadDto } from './dto/message.dto';
import { MessageService } from './message.service';

@Injectable()
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @ApiOperation({ summary: '查询未读消息列表' })
  @Post('/list')
  async list(@QueryUser('id') userId) {
    return await this.messageService.getAllAndCount(userId);
  }

  @ApiOperation({ summary: '标为已读' })
  @Post('/markRead')
  async markRead(@QueryUser('id') userId, payload: MessageMarkReadDto) {
    return await this.messageService.markRead(userId, payload.id);
  }
}
