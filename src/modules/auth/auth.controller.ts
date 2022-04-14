import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { generateCaptcha } from 'src/utils/captcha';
import { AuthService } from './auth.service';
import {
  LoginInputDto,
  LoginWithGithubInputDto,
  RegisterInputDto,
} from './dto/auth.dto';

@ApiTags('认证管理')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录
   * @param user
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: LoginInputDto) {
    const res = this.authService.loginWithCaptcha(user);
    return res;
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() payload: RegisterInputDto) {
    const res = this.authService.register(payload);
    return res;
  }

  @Post('loginWithGithub')
  loginWithGithub(@Body() payload: LoginWithGithubInputDto) {
    return this.authService.loginWithGithub(payload.code);
  }
}
