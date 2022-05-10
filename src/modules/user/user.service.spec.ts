import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, INestApplication } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThirdAccount, User } from './entities/user.entity';
import { getConnection } from 'typeorm';

describe('test user service', () => {
  let service: UserService;
  let module: TestingModule;

  const userName = '_testName';
  const email = '_testEmail@qq.com';
  const password = '123456';

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '123456',
          database: 'lenjoy_test',
          entities: [User, ThirdAccount],
          charset: 'utf8mb4',
          timezone: '+08:00',
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, ThirdAccount]),
      ],
      providers: [UserService],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  afterAll(async () => {
    getConnection().close();
    // done();
  });

  it('init service', () => {
    expect(service != null).toEqual(true);
  });
  it('create user', async () => {
    const user = await service.create({
      username: userName,
      password: password,
      email: email,
    });
    expect(user.username).toEqual(userName);
  });
  it('create user with repeat usernmae', async () => {
    expect(async () => {
      await service.create({
        username: userName,
        password: password,
        email: email,
      });
    }).rejects.toThrow(new HttpException('用户已存在', HttpStatus.BAD_REQUEST));
  });
  it('create user with repeat email', async () => {
    try {
      await service.create({
        username: userName + 2,
        password: '123456',
        email: email,
      });
    } catch (error) {
      expect(error).toEqual(
        new HttpException('邮箱已被使用', HttpStatus.BAD_REQUEST),
      );
    }
  });
  it('find one user with userId', async () => {
    const user = await getConnection()
      .getRepository(User)
      .findOne({ username: userName });
    const newuser = await service.findById(user.id);
    expect(newuser.username).toEqual(userName);
  });

  it('test login', async () => {
    const loginUser = await service.login(userName, password);
    expect(loginUser.username).toBe(userName);
  });
  //TODO: case password没有进行加密
  it('test login with error password', async () => {
    try {
      await service.login(userName, password + 'error');
    } catch (error) {
      expect(error).toEqual(
        new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST),
      );
    }
  });

  it('delete user with userId', async () => {
    const user = await getConnection()
      .getRepository(User)
      .findOne({ username: userName });
    await service.remove(user.id);
    const newuser = await getConnection().getRepository(User).findOne(user.id);
    expect(newuser).toBeFalsy();
  });
});
