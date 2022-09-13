import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { generateCaptcha } from 'src/utils/captcha';
import { CaptchaService } from './captcha.service';
import { v4 as uuidv4 } from 'uuid';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryCaptchaOutDto } from './dto/query-captcha.dto';
import { ResponseDto } from 'src/common/base.dto';

@ApiTags('验证码')
@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @ApiOperation({ summary: '获取验证吗' })
  @ApiResponse({ status: 201, type: QueryCaptchaOutDto })
  @Post('get')
  findOne() {
    // return this.captchaService.findOne();
    const id = uuidv4();
    const imgUrl = `http://localhost:3000/api/captcha/show?id=${id}`;
    return {
      id,
      imgUrl,
    };
  }

  @ApiOperation({ summary: '展示验证码' })
  // @ApiResponse({ status: 201, type:  })
  @Get('show')
  async show(@Res() res, @Query('id') id) {
    // const svgCaptcha = generateCaptcha();
    const img = this.captchaService.create(id);
    res.type('image/svg+xml'); //指定返回的类型
    res.send(img.data); //给页面返回一张图片
  }

  @ApiOperation({ summary: '验证验证码' })
  @ApiResponse({ status: 201, type: ResponseDto })
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
