import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { ProductService } from '../product/product.service';
import { OrderService } from '../order/order.service';
import { CategoryService } from '../category/category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { FilesService } from '../files/files.service';
import { UserService } from '../user/user.service';
import { BrandService } from '../brand/brand.service';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [OrderModule],
  controllers: [OrderItemController],
  providers: [
    OrderItemService,
    ProductService,
    OrderService,
    CategoryService,
    SubcategoryService,
    FilesService,
    BrandService,
    UserService,
  ],
})
export class OrderItemModule {}
