import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmialService } from './email.service';
import { QueryUser } from 'src/decorators/user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('email')
export class EmialController {
  constructor(private readonly emailService: EmialService) {}

  /**
   *
   * @returns 发送验证邮箱的邮件
   */
  @ApiOperation({ summary: '发送邮箱验证邮件给用户' })
  @UseGuards(JwtAuthGuard)
  @Post('/sendVerifyEmail')
  async sendVerifyEmail(@QueryUser() user: User) {
    return await this.emailService.sendVerifyEmail(
      { userId: user.id, username: user.username, email: user.email },
      '请验证邮箱',
    );
  }
}
