import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from '../score/entities/score.entity';
import { TopicService } from './topic.service';
import { Topic } from './entities/topic.entity';
import { getConnection } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';
import { ScoreService } from '../score/score.service';
import { ThirdAccount, User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { title } from 'process';

describe('test topic service', () => {
  let service: TopicService;
  let module: TestingModule;

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
          entities: [Topic, Score, Category],
          charset: 'utf8mb4',
          timezone: '+08:00',
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Topic, Score, Category]),
      ],
      providers: [
        TopicService,
        {
          provide: CategoryService,
          useValue: {
            findById: (id: string): Promise<Partial<Category>> => {
              return Promise.resolve({
                id: '1',
                name: 'testCategory',
                label: 'test',
              });
            },
          },
        },
        {
          provide: ScoreService,
          useValue: {
            operate: (): void => {},
          },
        },
      ],
    }).compile();
    service = module.get<TopicService>(TopicService);
  });

  afterAll(async () => {
    await getConnection().getRepository(Topic).clear();
    getConnection().close();
    // done();
  });
  it('init topic service', () => {
    expect(service != null).toEqual(true);
  });
  it('create topic', async () => {
    const userId = '007';
    const categoryId = '007';
    const title = '????????????';
    const content = '??????????????????';
    const topic = await service.create(userId, title, content, categoryId);
    const existTopic = await getConnection()
      .getRepository(Topic)
      .findOne(topic.id);
    expect(existTopic.title).toBe(title);
  });
  it('update topic', async () => {
    const categoryId = '007';
    const title = '????????????';
    const content = '??????????????????';
    const updatedTitle = '????????????????????????';
    const updatedContent = '??????????????????????????????';
    const old = await getConnection()
      .getRepository(Topic)
      .findOne({ title: title });
    await service.update({
      id: old.id,
      title: updatedTitle,
      content: updatedContent,
      categoryId,
    });
    const newTopic = await getConnection().getRepository(Topic).findOne(old.id);
    expect(newTopic.title).toBe(updatedTitle);
    expect(newTopic.content).toBe(updatedContent);
  });

  it('increase view', async () => {
    const old = await getConnection().getRepository(Topic).findOne();
    await service.IncrViewCount(old.id);
    const updated = await getConnection().getRepository(Topic).findOne(old.id);
    expect(updated.viewCount).toBe(1);
  });

  it('delete topic', async () => {
    const title = '????????????????????????';
    const old = await getConnection().getRepository(Topic).findOne({ title });
    await service.delete(old.id);
    const exist = await getConnection().getRepository(Topic).findOne(title);
    expect(exist).toBeFalsy();
  });
});
