import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4200;

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });
  app.use(cookieParser());

  await app.listen(PORT);
}

bootstrap();
