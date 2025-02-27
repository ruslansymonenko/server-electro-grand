import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as process from 'node:process';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4200;
  const publicPath: string = join(process.cwd(), 'public');

  app.setGlobalPrefix('backend');
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });
  app.useStaticAssets(join(publicPath), {
    prefix: '/public',
  });
  app.use(cookieParser());

  await app.listen(PORT);
}

bootstrap();
