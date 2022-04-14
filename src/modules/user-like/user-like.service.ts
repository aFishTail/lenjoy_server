import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserLikeDto } from './dto/create-user-like.dto';
import { UpdateUserLikeDto } from './dto/update-user-like.dto';
import { UserLike } from './entities/user-like.entity';

@Injectable()
export class UserLikeService {
  constructor(
    @InjectRepository(UserLike)
    private userLikeRepository: Repository<UserLike>,
  ) {}
  create(createUserLikeDto: CreateUserLikeDto) {
    return 'This action adds a new userLike';
  }

  findAll() {
    return `This action returns all userLike`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userLike`;
  }

  update(id: number, updateUserLikeDto: UpdateUserLikeDto) {
    return `This action updates a #${id} userLike`;
  }

  remove(id: number) {
    return `This action removes a #${id} userLike`;
  }
}
