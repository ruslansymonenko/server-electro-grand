import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { PrismaService } from '../prisma.service';
import { ProductService } from '../product/product.service';
import { OrderService } from '../order/order.service';
import { CategoryService } from '../category/category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { FilesService } from '../files/files.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [OrderItemController],
  providers: [
    OrderItemService,
    PrismaService,
    ProductService,
    OrderService,
    CategoryService,
    SubcategoryService,
    FilesService,
    UserService,
  ],
})
export class OrderItemModule {}
