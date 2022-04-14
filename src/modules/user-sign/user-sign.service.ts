import { Injectable } from '@nestjs/common';
import { CreateUserSignDto } from './dto/create-user-sign.dto';
import { UpdateUserSignDto } from './dto/update-user-sign.dto';

@Injectable()
export class UserSignService {
  create(createUserSignDto: CreateUserSignDto) {
    return 'This action adds a new userSign';
  }

  findAll() {
    return `This action returns all userSign`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userSign`;
  }

  update(id: number, updateUserSignDto: UpdateUserSignDto) {
    return `This action updates a #${id} userSign`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSign`;
  }
}
