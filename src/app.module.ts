import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicModule } from './modules/topic/topic.module';
import { CategoryModule } from './modules/category/category.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommentModule } from './modules/comment/comment.module';
import { ScoreModule } from './modules/score/score.module';
import { FollowModule } from './modules/follow/follow.module';
import { UserLikeModule } from './modules/user-like/user-like.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { UserSignModule } from './modules/user-sign/user-sign.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Log4jsModule } from './logger';
import { CaptchaModule } from './modules/captcha/captcha.module';
import { CacheModule } from './modules/cache/cache.module';
import { EmailModule } from './modules/email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { FileModule } from './modules/file/file.module';
import { MessageModule } from './modules/message/message.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'dev.env',
      isGlobal: true,
    }),
    TopicModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // type: 'mysql',
        // host: '127.0.0.1',
        // port: parseInt(configService.get('DATABASE_PORT')),
        // username: configService.get('DATABASE_USER'),
        // password: configService.get('DATABASE_PASSWORD'),
        // database: configService.get('DATABASE_NAME'),
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'lenjoy',
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
      }),
    }),
    CategoryModule,
    UserModule,
    AuthModule,
    CommentModule,
    ScoreModule,
    FollowModule,
    UserLikeModule,
    FavoriteModule,
    UserSignModule,
    Log4jsModule.forRoot(),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
