import { Test, TestingModule } from '@nestjs/testing';
import { UserSignService } from './user-sign.service';

describe('UserSignService', () => {
  let service: UserSignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSignService],
    }).compile();

    service = module.get<UserSignService>(UserSignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
