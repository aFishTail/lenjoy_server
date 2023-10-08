import { Module } from '@nestjs/common';
import { UserSignService } from './user-sign.service';
import { UserSignController } from './user-sign.controller';

@Module({
  controllers: [UserSignController],
  providers: [UserSignService],
})
export class UserSignModule {}
