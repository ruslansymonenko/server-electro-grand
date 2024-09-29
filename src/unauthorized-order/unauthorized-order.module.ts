import { Module } from '@nestjs/common';
import { UnauthorizedOrderService } from './unauthorized-order.service';
import { UnauthorizedOrderController } from './unauthorized-order.controller';

@Module({
  controllers: [UnauthorizedOrderController],
  providers: [UnauthorizedOrderService],
})
export class UnauthorizedOrderModule {}
