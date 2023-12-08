import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomRequestException extends HttpException {
  public code: number;
  constructor(code: number, message: string) {
    super(message, HttpStatus.BAD_REQUEST);
    this.code = code;
  }
}
