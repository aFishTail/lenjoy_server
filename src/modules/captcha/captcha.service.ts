import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CacheService } from 'src/modules/cache/cache.service';
import { generateCaptcha } from 'src/utils/captcha';
import { CreateCaptchaDto } from './dto/create-captcha.dto';
import { UpdateCaptchaDto } from './dto/update-captcha.dto';

@Injectable()
export class CaptchaService {
  constructor(private cache: CacheService) {}
  async create(captchaId: string) {
    const img = generateCaptcha();
    const value = img.text;
    await this.cache.client.set(captchaId, value, 'EX', 60 * 60);
    return img;
  }

  async getCaptchaValue(id: string) {
    return await this.cache.client.get(id);
  }

  async validate(id: string, code: string): Promise<boolean> {
    const captchaValue = await this.cache.client.get(id);
    if (!captchaValue) {
      throw new HttpException('验证码不存在', HttpStatus.BAD_REQUEST);
    }
    if (code.toLocaleLowerCase !== captchaValue.toLocaleLowerCase) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
    return true;
  }
}
