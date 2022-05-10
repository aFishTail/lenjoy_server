import { NestApplication } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailModule } from 'src/modules/email/email.module';

const prefix = '/user';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let app: NestApplication;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            updateBasic: () => Promise.resolve(null),
            detail: () => Promise.resolve(null),
            remove: () => Promise.resolve(null),
            setEmail: () => Promise.resolve(null),
            verifyEmail: () => Promise.resolve(null),
          },
        },
      ],
      imports: [EmailModule],
    }).compile();
    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('get detail', async (done) => {
    const result = { id: 1, name: '张三' };
    jest.spyOn(userService, 'findById').mockImplementation(() => result as any);

    expect(await userController.detail({ id: '1' })).toBe(result);
  });
});
