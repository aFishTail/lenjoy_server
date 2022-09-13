import { ApiProperty } from '@nestjs/swagger';

export class QueryCaptchaOutDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  imgUrl: string;
}
