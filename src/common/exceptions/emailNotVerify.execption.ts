import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailNotVerifiedException extends HttpException {
  code = 10001;
  constructor() {
    super('email is not verified', HttpStatus.BAD_REQUEST);
  }
}
