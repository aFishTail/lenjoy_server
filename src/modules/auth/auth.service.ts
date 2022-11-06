import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/modules/user/entities/user.entity';
import {
  getGithubAccessToken,
  getGithubUserInfo,
  ThirdAccountUserInfo,
} from 'src/utils/github';
import { LoginInputDto, RegisterInputDto } from './dto/auth.dto';
import { CacheService } from 'src/modules/cache/cache.service';
import { CaptchaService } from 'src/modules/captcha/captcha.service';
import { ThirdAccountType } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService, // private readonly configService: ConfigService,
    private readonly cache: CacheService,
    private readonly captchaService: CaptchaService,
  ) {}

  createToken(user: Partial<User>) {
    return this.jwtService.sign(user);
  }

  async login(user: LoginInputDto) {
    const { password, username } = user;
    const data = await this.userService.login(username, password);
    const token = this.createToken({
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    });
    return Object.assign(data, { token });
  }
  async loginWithCaptcha(user: LoginInputDto) {
    const { captchaId, captchaCode, username, password } = user;
    await this.captchaService.validate(captchaId, captchaCode);
    const data = await this.userService.login(username, password);
    const token = this.createToken({
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    });
    return Object.assign(data, { token });
  }

  async register(user: RegisterInputDto) {
    const { captchaId, captchaCode, username, password } = user;
    await this.captchaService.validate(captchaId, captchaCode);
    await this.userService.create(user);
    return await this.userService.login(username, password);
  }

  async validateUser(payload: User) {
    return await this.userService.findById(payload.id);
  }

  async loginWithGithub(code: string) {
    const accessToken = await getGithubAccessToken(code);
    const userInfo = await getGithubUserInfo(accessToken);
    const user = await this.getOrCreateByGithub(userInfo);
    const token = this.createToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    return Object.assign(user, { token });
  }

  async userInfo(userId: string) {
    return await this.userService.findById(userId);
  }

  async getOrCreateByGithub(userInfo: ThirdAccountUserInfo): Promise<User> {
    const thirdAccount = await this.userService.findThirdAccount(
      userInfo,
      ThirdAccountType.GITHUB,
    );
    if (thirdAccount) {
      return thirdAccount.user;
    }

    const user = await this.userService.createThirdAccount(
      userInfo,
      ThirdAccountType.GITHUB,
    );

    return user;
  }
}
