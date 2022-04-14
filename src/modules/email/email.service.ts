import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getManager, Repository } from 'typeorm';
import { EmailCode } from './entities/emailCode.entity';
import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class EmialService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(EmailCode)
    private readonly emialCodeRepository: Repository<EmailCode>,
  ) {}
  async sendVerifyEmail(
    user: { userId: string; username: string; email: string },
    subject: string,
  ) {
    const { userId, username, email } = user;
    const emailCode = await this.emialCodeRepository.create({
      userId,
      email,
    });
    await this.emialCodeRepository.save(emailCode);
    const url = `http://127.0.0.1:3001/user/verify?code=${emailCode.id}`;
    const context = {
      username,
      url,
      sign: '系统邮件，回复无效',
      date: new Date(),
    };
    await this.mailerService.sendMail({
      to: email,
      from: 'lenjoy007@163.com',
      subject,
      template: 'email',
      context,
    });
    return null;
  }

  async verify(userId: string, code: string) {
    const emailCode = await this.emialCodeRepository.findOne(code);
    if (!emailCode || emailCode.userId !== userId) {
      throw new HttpException('非法请求', HttpStatus.BAD_REQUEST);
    }
    if (emailCode.used) {
      throw new HttpException('已经验证过', HttpStatus.BAD_REQUEST);
    }
    const isAfterOneDay = dayjs(emailCode.createAt).isAfter(
      dayjs(emailCode.createAt).add(1, 'day'),
    );
    if (isAfterOneDay) {
      throw new HttpException('验证邮箱已过期', HttpStatus.BAD_REQUEST);
    }
    await getManager().transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .update(User)
        .set({ emailVerified: true })
        .where('id = :userId', { userId })
        .execute();

      await manager
        .createQueryBuilder()
        .update(EmailCode)
        .set({ used: true })
        .where('id = :id', { id: emailCode.id })
        .execute();
    });
    return null;
  }
}
