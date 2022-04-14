import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { generateCaptcha } from 'src/utils/captcha';
import { CaptchaService } from './captcha.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Post('get')
  findOne() {
    // return this.captchaService.findOne();
    const id = uuidv4();
    const imgUrl = `http://localhost:3000/captcha/show?id=${id}`;
    return {
      id,
      imgUrl,
    };
  }

  @Get('show')
  async captcha(@Res() res, @Query('id') id) {
    // const svgCaptcha = generateCaptcha();
    const img = this.captchaService.create(id);
    res.type('image/svg+xml'); //指定返回的类型
    res.send(img.data); //给页面返回一张图片
  }

  @Post('verify')
  async verify(@Body() payload) {
    // const svgCaptcha = generateCaptcha();
    const { captchaId, value } = payload;
    const captchaValue = await this.captchaService.getCaptchaValue(captchaId);
    return {
      flag: captchaValue === value,
    };
  }
}
