import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from '../prisma.service';
import { OrderService } from '../order/order.service';
import { UserService } from '../user/user.service';
import { FilesModule } from '../files/files.module';
import { SubcategoryModule } from '../subcategory/subcategory.module';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';
import { OrderItemService } from '../order-item/order-item.service';

@Module({
  imports: [FilesModule, SubcategoryModule, CategoryModule, ProductModule],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService, OrderService, UserService, OrderItemService],
})
export class PaymentModule {}
