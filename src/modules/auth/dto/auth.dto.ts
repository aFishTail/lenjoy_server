import { IsEmail, IsString } from 'class-validator';
export class LoginWithGithubInputDto {
  @IsString()
  code: string;
}

export class RegisterInputDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  captchaId: string;

  @IsString()
  captchaCode: string;
}

export class LoginInputDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  captchaId: string;

  @IsString()
  captchaCode: string;
}

export class LoginWithoutCaptchaDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
