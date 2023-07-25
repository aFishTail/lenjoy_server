import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // return 'Hello World!';
  }
}
