import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IMessageType } from 'src/common/constants';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}
  // 发送消息
  async sendMessage(
    from: string,
    to: string,
    type: IMessageType,
    title: string,
    content: string,
    quoteContent: string,
  ) {
    await this.messageRepository.create({
      fromUserId: from,
      userId: to,
      type,
      title,
      content,
      quoteContent,
    });
    return;
  }
  // 将所有消息标为已读
  async markRead(userId: string, msgId?: string) {
    const qb = this.messageRepository
      .createQueryBuilder()
      .update({ status: 1 })
      .where({ userId });
    if (msgId) {
      qb.andWhere({ id: msgId });
    }
    await qb.execute();
    return null;
  }

  // 获取所有未读消息及数量
  async getAllAndCount(userId: string) {
    const [records, total] = await this.messageRepository.findAndCount({
      where: { userId },
    });
    return {
      records,
      total,
    };
  }
}
