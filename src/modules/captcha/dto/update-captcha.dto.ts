import { PartialType } from '@nestjs/swagger';
import { CreateCaptchaDto } from './create-captcha.dto';

export class UpdateCaptchaDto extends PartialType(CreateCaptchaDto) {}
