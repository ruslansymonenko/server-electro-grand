import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrderItem, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ProductService } from '../product/product.service';
import { OrderItemDto, UpdateOrderItemDto } from './dto/order-item.dto';
import { OrderService } from '../order/order.service';

interface IOrderItemService {
  create(dto: OrderItemDto): Promise<OrderItem | null>;
  getById(id: number): Promise<OrderItem | null>;
  getByOrderId(orderId: number): Promise<OrderItem[] | null>;
  update(id: number, dto: UpdateOrderItemDto): Promise<OrderItem | null>;
  delete(id: number): Promise<OrderItem | null>;
}

@Injectable()
export class OrderItemService implements IOrderItemService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductService,
    private orderService: OrderService,
  ) {}

  async create(dto: OrderItemDto): Promise<OrderItem | null> {
    try {
      const isOrder = await this.orderService.getById(dto.orderId);

      if (!isOrder) throw new BadRequestException('Order was not found');

      const isProduct = await this.productService.getById(dto.productId);

      if (!isProduct) throw new BadRequestException('Product not found');

      const orderItem = await this.prisma.orderItem.create({
        data: {
          orderId: dto.orderId,
          quantity: dto.quantity,
          price: dto.price,
          productId: dto.productId,
        },
      });

      if (!orderItem) throw new InternalServerErrorException('Error creating order item');

      return orderItem;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getById(id: number): Promise<OrderItem | null> {
    try {
      const orderItem = await this.prisma.orderItem.findUnique({
        where: {
          id: id,
        },
      });

      if (!orderItem) throw new NotFoundException('Error getting orderItem');

      return orderItem;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getByOrderId(orderId: number): Promise<OrderItem[] | null> {
    try {
      const orderItems = await this.prisma.orderItem.findMany({
        where: {
          orderId: orderId,
        },
      });

      if (!orderItems) throw new NotFoundException('Error getting orderItems');

      return orderItems;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, dto: UpdateOrderItemDto): Promise<OrderItem | null> {
    try {
      const isOrderItem = await this.getById(id);

      if (!isOrderItem) throw new BadRequestException('Order item not found');

      const updateData: Prisma.OrderItemUpdateInput = {};

      if (dto.quantity !== undefined) {
        updateData.quantity = dto.quantity;
      }

      if (dto.price !== undefined) {
        updateData.price = dto.price;
      }

      if (dto.orderId !== undefined) {
        updateData.order = {
          connect: { id: dto.orderId },
        };
      }

      if (dto.productId !== undefined) {
        updateData.product = {
          connect: { id: dto.productId },
        };
      }

      const updatedOrderItem = await this.prisma.orderItem.update({
        where: {
          id: id,
        },
        data: updateData,
      });

      if (!updatedOrderItem)
        throw new InternalServerErrorException('Error while updating' + ' order item');

      return updatedOrderItem;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update order item: ${error}`);
    }
  }

  async delete(id: number): Promise<OrderItem | null> {
    try {
      const orderItem = await this.prisma.orderItem.delete({
        where: {
          id: id,
        },
      });

      if (!orderItem) throw new InternalServerErrorException('Error deleting order item');

      return orderItem;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete order item', error.message);
    }
  }
}
