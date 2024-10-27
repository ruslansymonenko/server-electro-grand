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
import { OrderItemModule } from './order-item/order-item.module';
import { ReviewModule } from './review/review.module';
import { PaymentModule } from './payment/payment.module';
import { FilesModule } from './files/files.module';
import { BrandModule } from './brand/brand.module';
import { AttributeModule } from './attribute/attribute.module';
import { AttributeValueModule } from './attribute-value/attribute-value.module';
import { ProductAttributeModule } from './product-attribute/product-attribute.module';

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
    OrderItemModule,
    ReviewModule,
    PaymentModule,
    FilesModule,
    BrandModule,
    AttributeModule,
    AttributeValueModule,
    ProductAttributeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
