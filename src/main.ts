import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { HttpExceptionFilter } from './filters/http-execption.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { loggerMiddleware } from './middleware/logger.middleware';
import { ValidationPipe } from './pipe/validation.pipe';
import helmet from 'helmet';
import * as compression from 'compression';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { format } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf } = format;
const myFormat = printf(({ level, message, timestamp }) => {
  const time = new Date(timestamp).toLocaleString();
  return `${time} ${level}: ${message}`;
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.DailyRotateFile({
          dirname: `logs`, // 日志保存的目录
          filename: '%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
          datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
          zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
          maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
          maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
          // 记录时添加时间戳信息
          // format: winston.format.combine(
          //   winston.format.timestamp({
          //   	format: 'YYYY-MM-DD HH:mm:ss',
          //   }),
          //   winston.format.json(),
          // ),
          format: combine(timestamp(), myFormat),
        }),
      ],
    }),
  });

  // app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // app.use(bodyParser.json({ limit: '1mb' }));
  // app.use(bodyParser.urlencoded({ extended: true }));

  // app.useLogger(app.get(Log4jsLogger));
  app.use(loggerMiddleware);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.useStaticAssets('public', {
    prefix: '/static',
  });

  app.setGlobalPrefix('/api');
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('lenjoy api 文档')
    .setDescription('lenjoy api 文档')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
process.on('uncaughtException', (err) => {
  console.log('捕获到了未知错误', err);
  // process.exit(1);
});
bootstrap();
