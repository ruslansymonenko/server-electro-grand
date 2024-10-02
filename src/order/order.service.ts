import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EnumOrderStatus, Order, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { OrderDto, UpdateOrderDto } from './dto/order.dto';
import { ProductService } from '../product/product.service';

interface IOrderService {
  create(dto: OrderDto): Promise<Order | null>;
  getAll(searchParams?: any): Promise<Order[] | null>;
  getById(id: number): Promise<Order | null>;
  getByUserId(userId: number): Promise<Order[] | null>;
  update(id: number, dto: UpdateOrderDto): Promise<Order | null>;
  delete(id: number): Promise<Order | null>;
}

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async create(dto: OrderDto): Promise<Order | null> {
    try {
      if (dto.userId) {
        const isUser = this.userService.findById(dto.userId);
        if (!isUser) throw new BadRequestException('User was not found');
      }

      for (const item of dto.orderItems) {
        const isProduct = await this.productService.getById(item.productId);

        if (!isProduct) {
          throw new BadRequestException(`Product with ID ${item.productId} not found`);
        }
      }

      const order = await this.prisma.order.create({
        data: {
          userId: dto.userId ? dto.userId : null,
          status: dto.status ? dto.status : EnumOrderStatus.NEW,
          orderItems: {
            create: dto.orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      if (!order) throw new InternalServerErrorException('Error creating order');

      return order;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getById(id: number): Promise<Order | null> {
    try {
      const order = await this.prisma.order.findUnique({
        where: {
          id: id,
        },
        include: {
          orderItems: {
            include: { product: true },
          },
        },
      });

      if (!order) throw new NotFoundException('Error getting order');

      return order;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAll(searchParams?: any): Promise<Order[] | null> {
    try {
      const orders = await this.prisma.order.findMany({
        include: {
          orderItems: {
            include: { product: true },
          },
        },
      });

      if (!orders) throw new InternalServerErrorException('Orders was not found');

      return orders;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get orders', error.message);
    }
  }

  async getByUserId(userId: number): Promise<Order[] | null> {
    try {
      const orders = await this.prisma.order.findMany({
        where: {
          userId: userId,
        },
        include: {
          orderItems: {
            include: { product: true },
          },
        },
      });

      if (!orders) throw new NotFoundException('Error getting orders');

      return orders;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, dto: UpdateOrderDto): Promise<Order | null> {
    try {
      const isOrderItem = await this.getById(id);

      if (!isOrderItem) throw new BadRequestException('Order item not found');

      const updateData: Prisma.OrderUpdateInput = {};

      if (dto.status !== undefined) {
        updateData.status = dto.status;
      }

      if (dto.userId !== undefined) {
        updateData.user = {
          connect: { id: dto.userId },
        };
      }

      const updatedOrder = await this.prisma.order.update({
        where: {
          id: id,
        },
        data: updateData,
        include: {
          orderItems: {
            include: { product: true },
          },
        },
      });

      if (!updatedOrder) throw new InternalServerErrorException('Error while updating' + ' order');

      return updatedOrder;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update order: ${error}`);
    }
  }

  async delete(id: number): Promise<Order | null> {
    try {
      const order = await this.prisma.order.delete({
        where: {
          id: id,
        },
      });

      if (!order) throw new InternalServerErrorException('Error deleting order');

      return order;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete order', error.message);
    }
  }
}
