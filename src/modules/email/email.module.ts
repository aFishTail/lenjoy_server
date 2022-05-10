import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { EmialController } from './email.controller';
import { EmialService } from './email.service';
import { EmailCode } from './entities/emailCode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailCode])],
  controllers: [EmialController],
  providers: [EmialService],
  exports: [EmialService],
})
export class EmailModule {}
