import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  UpdateUserBasicDto,
  UpdateUserPasswordDto,
} from './dto/update-user.dto';
import { DataSource, Repository } from 'typeorm';
import { ThirdAccount, User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityTypeEnum, ThirdAccountType } from 'src/common/constants';
import { ThirdAccountUserInfo } from 'src/utils/github';
import { UserBehavior } from './entities/user-behavior.entity';
import { ScoreService } from '../score/score.service';
import { ScoreConfig, ScoreDesc, ScoreOperateType } from '../score/score.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ThirdAccount)
    private readonly thirdAccountRepository: Repository<ThirdAccount>,
    @InjectRepository(UserBehavior)
    private readonly userBehaviorRepository: Repository<UserBehavior>,
    private readonly dataSource: DataSource,
    private readonly scoreService: ScoreService,
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
    await this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const userBehaviorRepository = manager.getRepository(UserBehavior);
      const newUser = await userRepository.create(user);
      await userRepository.save(newUser);
      const userBehavior = await userBehaviorRepository.create({
        user: newUser,
      });
      await userBehaviorRepository.save(userBehavior);
    });
  }

  /**
   * 获取指定用户
   * @param id
   */
  async findById(id): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
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

    if (!existUser || !User.comparePassword(password, existUser.password)) {
      throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST);
    }

    if ((await existUser).status === 'locked') {
      throw new HttpException('用户已锁定，无法登录', HttpStatus.BAD_REQUEST);
    }
    return existUser;
  }

  async update(user: Partial<User>): Promise<any> {
    const { id, email } = user;
    const oldUser = await this.userRepository.findOne({ where: { id } });
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
      if (existUserByEmail && existUserByEmail.id !== id) {
        throw new HttpException('邮箱已被使用', HttpStatus.BAD_REQUEST);
      }
    }
    const newUser = this.userRepository.merge(oldUser, user);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async updateBasic(user: UpdateUserBasicDto & { id: string }) {
    const { id } = user;
    const olduser = await this.userRepository.findOne({ where: { id } });
    if (!olduser) {
      throw new BadRequestException('用户不存在');
    }
    const newUser = this.userRepository.merge(olduser, user);
    return await this.userRepository.save(newUser);
  }

  async updatePassword(p: UpdateUserPasswordDto): Promise<User> {
    const { id } = p;
    const existUser = await this.userRepository.findOne({ where: { id } });
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
      if (existUserByEmail.id === userId) return null;
      throw new HttpException('邮箱已被使用', HttpStatus.BAD_REQUEST);
    }
    await this.userRepository.update(userId, { email });
    return null;
  }

  async remove(userId: string) {
    await this.userRepository.delete(userId);
  }

  async findThirdAccount(userInfo, type: ThirdAccountType) {
    // 解决typeorm 实体关系
    return await this.thirdAccountRepository.findOne({
      where: { thirdId: userInfo.id, thirdType: type },
      relations: {
        user: true,
      },
    });
  }

  async createThirdAccount(
    userInfo: ThirdAccountUserInfo,
    type: ThirdAccountType,
  ): Promise<User> {
    let user;
    await this.dataSource.transaction(async (manager) => {
      user = await manager.getRepository(User).create({
        username: userInfo.name,
        nickname: userInfo.name,
        avatar: userInfo.avatar_url,
        email: userInfo.name,
        description: userInfo.bio,
      });

      await manager.getRepository(User).save(user);

      const thirdAccount = await manager.getRepository(ThirdAccount).create({
        nickname: userInfo.name,
        avatar: userInfo.name,
        thirdId: userInfo.id + '',
        thirdType: type,
        user: user,
      });

      await manager.getRepository(ThirdAccount).save(thirdAccount);
    });
    return user;
  }

  async postFirstContent(
    userId: string,
    entityType: EntityTypeEnum,
    entityId: string,
  ) {
    const userBehavior = await this.userBehaviorRepository
      .createQueryBuilder('userBehavior')
      .where('userBehavior.userId =:userId', { userId })
      .getOne();
    switch (entityType) {
      case EntityTypeEnum.Topic:
        if (!userBehavior.haveFirstTopic) {
          this.dataSource.manager.transaction(async (manager) => {
            userBehavior.haveFirstTopic = true;
            await manager.getRepository(UserBehavior).save(userBehavior);
            await this.scoreService.operateWithTransaction(
              manager,
              userId,
              {
                type: ScoreOperateType.INCREASE,
                score: ScoreConfig.PostFirstTopic,
                desc: ScoreDesc.PostFirstTopic,
              },
              entityId,
              entityType,
            );
          });
        }
        break;
      case EntityTypeEnum.Resource:
        if (!userBehavior.haveFirstResource) {
          this.dataSource.manager.transaction(async (manager) => {
            userBehavior.haveFirstResource = true;
            await manager.getRepository(UserBehavior).save(userBehavior);
            await this.scoreService.operateWithTransaction(
              manager,
              userId,
              {
                type: ScoreOperateType.INCREASE,
                score: ScoreConfig.PostFirstResource,
                desc: ScoreDesc.PostFirstResource,
              },
              entityId,
              entityType,
            );
          });
        }
        break;
      case EntityTypeEnum.Reward:
        if (!userBehavior.haveFirstReward) {
          this.dataSource.manager.transaction(async (manager) => {
            userBehavior.haveFirstReward = true;
            await manager.getRepository(UserBehavior).save(userBehavior);
            await this.scoreService.operateWithTransaction(
              manager,
              userId,
              {
                type: ScoreOperateType.INCREASE,
                score: ScoreConfig.PostFirstReward,
                desc: ScoreDesc.PostFirstReward,
              },
              entityId,
              entityType,
            );
          });
        }
        break;
      default:
        break;
    }
  }
}
