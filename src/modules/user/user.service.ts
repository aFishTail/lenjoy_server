import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UpdateUserBasicDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(user: Partial<User>) {
    const { username, password, email, nickname } = user;
    if (!username || !password) {
      throw new HttpException('请输入用户名和密码', HttpStatus.BAD_REQUEST);
    }
    const existUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }
    const existUserByEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existUserByEmail) {
      throw new HttpException('邮箱已被使用', HttpStatus.BAD_REQUEST);
    }
    if (!nickname) {
      user.nickname = username;
    }
    const newUser = await this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  /**
   * 获取指定用户
   * @param id
   */
  async findById(id): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new HttpException('未查询到该用户', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async findAll(queryParam): Promise<any> {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.createAt', 'DESC');
    const { pageNum = 1, pageSize = 10, status, username } = queryParam;
    qb.skip((pageNum - 1) * pageSize);
    qb.take(pageSize);
    if (status) {
      qb.andWhere('user.status=:status').setParameter('status', status);
    }
    if (username) {
      qb.andWhere(`user.username LIKE :username`, {
        username: `%${username}%`,
      });
    }
    // if (otherParams) {
    //   Object.keys(otherParams).forEach((key) => {
    //     qb.andWhere(`user.${key} LIKE :${key}`).setParameter(
    //       `${key}`,
    //       `%${otherParams[key]}%`,
    //     );
    //   });
    // }
    const [records, total] = await qb.getManyAndCount();
    return {
      records,
      total,
    };
  }

  async login(username: string, password: string): Promise<User> {
    const existUser = await this.userRepository.findOne({
      where: { username },
    });

    const isPasswordValid = User.comparePassword(password, existUser.password);
    if (!existUser || !isPasswordValid) {
      throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST);
    }

    if ((await existUser).status === 'locked') {
      throw new HttpException('用户已锁定，无法登录', HttpStatus.BAD_REQUEST);
    }
    return existUser;
  }

  async update(user: Partial<User>): Promise<any> {
    const { id, email } = user;
    const oldUser = await this.userRepository.findOne(id);
    delete oldUser.password;
    if (user.username && user.username !== oldUser.username) {
      const existUser = await this.userRepository.findOne({
        where: { username: user.username },
      });
      if (existUser) {
        throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
      }
    }
    if (email) {
      const existUserByEmail = await this.userRepository.findOne({
        where: { email },
      });
      if (existUserByEmail) {
        throw new HttpException('邮箱已被使用', HttpStatus.BAD_REQUEST);
      }
    }
    const newUser = this.userRepository.merge(oldUser, user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async updateBasic(user: UpdateUserBasicDto & { id: string }) {
    const { id } = user;
    const olduser = await this.userRepository.findOne(id);
    if (!olduser) {
      throw new BadRequestException('用户不存在');
    }
    const newUser = this.userRepository.merge(olduser, user);
    await this.userRepository.save(newUser);
    return null;
  }

  async updatePassword(p: UpdateUserPasswordDto): Promise<User> {
    const { id } = p;
    const existUser = await this.userRepository.findOne(id);
    const { oldPassword, newPassword } = p;
    if (
      !existUser ||
      !(await User.comparePassword(oldPassword, existUser.password))
    ) {
      throw new HttpException(
        '用户名或密码错误',
        // tslint:disable-next-line: trailing-comma
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashNewPassword = User.encryptPassword(newPassword);
    const newUser = this.userRepository.merge(existUser, {
      password: hashNewPassword,
    });
    return await this.userRepository.save(newUser);
  }
  async setEmail(userId: string, email: string) {
    const existUserByEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existUserByEmail) {
      throw new HttpException('邮箱已被使用', HttpStatus.BAD_REQUEST);
    }
    await this.userRepository.update(userId, { email });
    return null;
  }
  async remove(userId: string) {
    await this.userRepository.delete(userId);
  }
}
