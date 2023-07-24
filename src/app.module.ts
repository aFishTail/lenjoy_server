import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicModule } from './modules/topic/topic.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommentModule } from './modules/comment/comment.module';
import { ScoreModule } from './modules/score/score.module';
import { UserLikeModule } from './modules/user-like/user-like.module';
import { UserSignModule } from './modules/user-sign/user-sign.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { Log4jsModule } from './logger';
import { CaptchaModule } from './modules/captcha/captcha.module';
import { CacheModule } from './modules/cache/cache.module';
import { EmailModule } from './modules/email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { FileModule } from './modules/file/file.module';
import { MessageModule } from './modules/message/message.module';
import { UserFavoriteModule } from './modules/user-favorite/user-favorite.module';
import * as path from 'path';
import { FollowModule } from './modules/user-follow/follow.module';
import { QueryUserMiddler } from './middleware/queryUser.middleware';
import { UserLike } from './modules/user-like/entities/user-like.entity';
import { ThirdAccount, User } from './modules/user/entities/user.entity';
import { Topic } from './modules/topic/entities/topic.entity';
import { Category } from './modules/category/entities/category.entity';
import { UserController } from './modules/user/user.controller';
import { Comment } from './modules/comment/entities/comment.entity';
import { Follow } from './modules/user-follow/entities/follow.entity';
import { Score } from './modules/score/entities/score.entity';
import { Message } from './modules/message/entities/message.entity';
import { EmailCode } from './modules/email/entities/emailCode.entity';
import { UserFavorite } from './modules/user-favorite/entities/user-favorite.entity';
import configuration from 'config/configuration';
import { AdminModule } from '@adminjs/nestjs';
import * as AdminJSTypeorm from '@adminjs/typeorm';
import AdminJS, { ResourceOptions, ResourceWithOptions } from 'adminjs';
import passwordsFeature from '@adminjs/passwords';
import * as bcrypt from 'bcryptjs';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

AdminJS.registerAdapter({
  Resource: AdminJSTypeorm.Resource,
  Database: AdminJSTypeorm.Database,
});

const UserResource: ResourceWithOptions = {
  resource: User,
  options: {
    properties: {
      email: {
        isRequired: true,
      },
      username: {
        isRequired: true,
      },
    },
  },
  features: [
    passwordsFeature({
      properties: { encryptedPassword: 'password' },
      hash: (password) => bcrypt.hashSync(password, 10),
    }),
  ],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TopicModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('mysql.host'),
        port: configService.get<number>('mysql.port'),
        username: configService.get<string>('mysql.username'),
        password: configService.get<string>('mysql.password'),
        database: configService.get<string>('mysql.database'),
        entities: [
          User,
          ThirdAccount,
          UserLike,
          UserFavorite,
          Topic,
          Category,
          UserController,
          Comment,
          Follow,
          Score,
          Message,
          EmailCode,
        ],
        charset: 'utf8mb4',
        timezone: '+08:00',
        synchronize: true,
        logging: true,
        migrationsTableName: 'custom_migration_table',
        migrations: ['migration/*.js'],
        cli: {
          migrationsDir: 'migration',
        },
      }),
    }),
    AdminModule.createAdmin({
      adminJsOptions: {
        rootPath: '/admin',
        resources: [
          UserResource,
          ThirdAccount,
          {
            resource: Topic,
            options: {
              properties: {
                content: {
                  type: 'richtext',
                },
              },
            },
          },
          Category,
          UserLike,
          UserFavorite,
          Comment,
          Follow,
          Score,
          Message,
          EmailCode,
        ],
      },
    }),
    UserModule,
    AuthModule,
    CommentModule,
    ScoreModule,
    FollowModule,
    UserLikeModule,
    UserSignModule,
    // Log4jsModule.forRoot(),
    CaptchaModule,
    CacheModule,
    EmailModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.163.com',
          port: '465',
          auth: {
            user: 'lenjoy007@163.com',
            pass: 'SQRYVKYBTEHJQFBW',
          },
        },
        defaults: {
          from: '"乐享<lenjoy007@163.com>"',
        },
        template: {
          dir: path.join(__dirname, './template'),
          adapter: new PugAdapter(),
          options: { strict: true },
        },
      }),
    }),
    FileModule,
    MessageModule,
    UserFavoriteModule,
    // WinstonModule.forRoot({
    //   transports: [
    //     new winston.transports.DailyRotateFile({
    //       dirname: `logs`, // 日志保存的目录
    //       filename: '%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
    //       datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
    //       zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
    //       maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
    //       maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
    //       // 记录时添加时间戳信息
    //       format: winston.format.combine(
    //         winston.format.timestamp({
    //         	format: 'YYYY-MM-DD HH:mm:ss',
    //         }),
    //         winston.format.json(),
    //       ),
    //     }),
    //   ],
    // })
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(QueryUserMiddler).forRoutes('*');
  }
}
