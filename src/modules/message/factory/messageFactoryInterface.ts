import { User } from 'src/modules/user/entities/user.entity';

export enum MessageTypeEnum {
  Topic = 'topic',
  Resource = 'resource',
  Reward = 'reward',
}

export interface MessageFactoryInterface {
  //   constructor(type: MessageTypeEnum);
  createMessage(): string;
}

export abstract class MessageFactory {
  private type: unknown;
  private entity: unknown;
  private fromUser: User;
  constructor(type: unknown, entity: unknown, fromUser: User) {
    this.type = type;
    this.entity = entity;
    this.fromUser = fromUser;
    return;
  }
  createMessage() {
    return '';
  }
}
