import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CLIENT_URL } from './consts/client';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { OrderModule } from './order/order.module';
import { UnauthorizedOrderModule } from './unauthorized-order/unauthorized-order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { ReviewModule } from './review/review.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      baseURL: CLIENT_URL,
      withCredentials: true,
    }),
    AuthModule,
    UserModule,
    ProductModule,
    CategoryModule,
    SubcategoryModule,
    OrderModule,
    UnauthorizedOrderModule,
    OrderItemModule,
    ReviewModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
