import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CLIENT_URL } from './consts/client';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      baseURL: CLIENT_URL,
      withCredentials: true,
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
