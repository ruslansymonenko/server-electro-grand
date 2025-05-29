import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SubcategoryDto, UpdateSubcategoryDto } from '../subcategory/dto/subcategory.dto';
import { EnumPaymentStatus, Payment, Prisma, Subcategory } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { OrderService } from '../order/order.service';
import { UserService } from '../user/user.service';
import { PaymentDto, UpdatePaymentDto } from './dto/payment.dto';

interface IPaymentService {
  create(dto: PaymentDto): Promise<Payment | null>;
  getAll(searchParams?: any): Promise<Payment[] | null>;
  getById(id: number): Promise<Payment | null>;
  getByOrderId(orderId: number): Promise<Payment[] | null>;
  getByUserId(userId: number): Promise<Payment[] | null>;
  update(id: number, dto: UpdatePaymentDto): Promise<Payment | null>;
  delete(id: number): Promise<Payment | null>;
}

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(
    private prisma: PrismaService,
    private orderService: OrderService,
    private userService: UserService,
  ) {}

  async create(dto: PaymentDto): Promise<Payment | null> {
    try {
      const isOrder = await this.orderService.getById(dto.orderId);

      if (!isOrder) throw new BadRequestException('Order not found');

      if (dto.userId) {
        const isUser = this.userService.findById(dto.userId);

        if (!isUser) throw new BadRequestException('User was not found');
      }

      const payment = await this.prisma.payment.create({
        data: {
          amount: dto.amount,
          status: EnumPaymentStatus.PENDING,
          orderId: dto.orderId,
          userId: dto.userId ? dto.userId : null,
        },
      });

      if (!payment) throw new InternalServerErrorException('Error creating payment');

      return payment;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAll(searchParams?: any): Promise<Payment[] | null> {
    try {
      const payments = await this.prisma.payment.findMany({});

      if (!payments) throw new InternalServerErrorException('Payments was not found');

      return payments;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get payments', error.message);
    }
  }

  async getById(id: number): Promise<Payment | null> {
    try {
      const payments = await this.prisma.payment.findUnique({
        where: {
          id: id,
        },
      });

      if (!payments) throw new NotFoundException('Error getting payment');

      return payments;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getByOrderId(orderId: number): Promise<Payment[] | null> {
    try {
      const payments = await this.prisma.payment.findMany({
        where: {
          orderId: orderId,
        },
      });

      if (!payments || payments.length === 0) throw new NotFoundException('Error getting payment');

      return payments;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getByUserId(userId: number): Promise<Payment[] | null> {
    try {
      const payments = await this.prisma.payment.findMany({
        where: {
          userId: userId,
        },
      });

      if (!payments) throw new NotFoundException('Error getting payment');

      return payments;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, dto: UpdatePaymentDto): Promise<Payment | null> {
    try {
      const updateData: Prisma.PaymentUpdateInput = {};

      if (dto.amount !== undefined) {
        updateData.amount = dto.amount;
      }

      if (dto.status !== undefined) {
        updateData.status = dto.status;
      }

      if (dto.orderId !== undefined) {
        updateData.order = {
          connect: { id: dto.orderId },
        };
      }

      if (dto.userId !== undefined) {
        updateData.user = {
          connect: { id: dto.userId },
        };
      }

      const updatedPayment = await this.prisma.payment.update({
        where: {
          id: id,
        },
        data: updateData,
      });

      if (!updatedPayment)
        throw new InternalServerErrorException('Error while updating' + ' payment');

      return updatedPayment;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update payment: ${error}`);
    }
  }

  async delete(id: number): Promise<Payment | null> {
    try {
      const subcategory = await this.prisma.payment.delete({
        where: {
          id: id,
        },
      });

      if (!subcategory) throw new InternalServerErrorException('Error deleting payment');

      return subcategory;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete payment', error.message);
    }
  }
}
