import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';
import { CategoryService } from '../category/category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { FilesService } from '../files/files.service';
import { BrandService } from '../brand/brand.service';
import { OrderItemService } from '../order-item/order-item.service';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    PrismaService,
    UserService,
    ProductService,
    CategoryService,
    SubcategoryService,
    BrandService,
    FilesService,
    OrderItemService,
  ],
})
export class OrderModule {}
