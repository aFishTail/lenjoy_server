import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { HttpExceptionFilter } from './filters/http-execption.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { Log4jsLogger } from './logger';
import { loggerMiddleware } from './middleware/logger.middleware';
import { ValidationPipe } from './pipe/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.useLogger(app.get(Log4jsLogger));
  app.use(loggerMiddleware);
  app.useGlobalInterceptors(new TransformInterceptor());
  // app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionFilter());
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
