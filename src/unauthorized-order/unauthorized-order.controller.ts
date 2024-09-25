import { Controller } from '@nestjs/common';
import { UnauthorizedOrderService } from './unauthorized-order.service';

@Controller('unauthorized-order')
export class UnauthorizedOrderController {
  constructor(private readonly unauthorizedOrderService: UnauthorizedOrderService) {}
}
