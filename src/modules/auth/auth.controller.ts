import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { QueryUser } from 'src/decorators/user.decorator';
import { AuthService } from './auth.service';
import {
  LoginInputDto,
  LoginWithGithubInputDto,
  LoginWithoutCaptchaDto,
  RegisterInputDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('认证管理')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录
   * @param user
   */
  @Post('login')
  async login(
    @Body() user: LoginInputDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.loginWithCaptcha(user);
    res.cookie('token', 'user123');
    // res.status(HttpStatus.OK).json(data);
    return data;
    // return res;
  }

  @Post('loginWithoutCaptcha')
  async loginWithoutCaptcha(@Body() user: LoginWithoutCaptchaDto) {
    const res = this.authService.loginWithCaptcha(user);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Post('userInfo')
  async userInfo(@QueryUser('id') userId) {
    const res = this.authService.userInfo(userId);
    return res;
  }

  @Post('register')
  async register(@Body() payload: RegisterInputDto) {
    const res = this.authService.register(payload);
    return res;
  }

  @Post('loginWithGithub')
  loginWithGithub(@Body() payload: LoginWithGithubInputDto) {
    return this.authService.loginWithGithub(payload.code);
  }
}
