import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../guards/jwt-auth.guardguard';
import { VerifyEmailDto } from './dto/send-email.dto';
import { EmialService } from './email.service';

@Controller('email')
export class EmialController {
  constructor(private readonly emailService: EmialService) {}

  /**
   *
   * @returns 发送验证邮箱的邮件
   */
  @UseGuards(JwtAuthGuard)
  @Post('/sendVerifyEmail')
  async sendVerifyEmail(@Req() req: Request) {
    const { user } = req as any;
    return await this.emailService.sendVerifyEmail(
      { userId: user.id, username: user.username, email: user.email },
      '请验证邮箱',
    );
  }

  /**
   * 验证邮件
   * @param payload
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Post('/verifyEmail')
  async verifyEmail(@Body() payload: VerifyEmailDto, @Req() req: Request) {
    const { user } = req as any;
    return await this.emailService.verify(user.id, payload.code);
  }
}
