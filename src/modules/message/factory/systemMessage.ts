import { MessageInterface } from './messageInterface';
import { SystemMessageTypeEnum } from './systemMessageFactory';

export class SystemMessage implements MessageInterface {
  private type: SystemMessageTypeEnum;
  private entityName: string;
  private fromUserName: string;
  constructor(type: SystemMessageTypeEnum) {
    this.type = type;
  }
  message(): string {
    switch (this.type) {
      case SystemMessageTypeEnum.DailySignIn:
        return `签到成功，获得积分`;
      case SystemMessageTypeEnum.FirstPost:
        return `感谢您发布第一个资源，乐享社区因为有你更美好，获得积分`;
    }
  }
}
