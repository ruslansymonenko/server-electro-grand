import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EnumUserRoles, Prisma, User } from '@prisma/client';
import { UserDto } from './dto/user.dto';
import { hash } from 'argon2';
import { PrismaService } from '../prisma.service';
import { UpdateUserDto } from './dto/user.dto';

interface IUserService {
  create(dto: UserDto): Promise<IUserReturnInfo | null>;
  createAdmin(dto: UserDto): Promise<User | null>;
  findById(userID: number): Promise<User | null>;
  findByEmail(userEmail: string): Promise<User | null>;
  update(userId: number, dto: UpdateUserDto): Promise<IUserReturnInfo | null>;
}

export interface IUserReturnInfo {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}

@Injectable()
export class UserService implements IUserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: UserDto): Promise<User | null> {
    try {
      const isUser: User = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (isUser) throw new BadRequestException('User already exists');

      const user: User = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: await hash(dto.password),
        },
      });

      if (!user) throw new InternalServerErrorException('Failed to create user');

      const updatedUser: User = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: `Customer #${user.id}`,
        },
      });

      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async createAdmin(dto: UserDto): Promise<User | null> {
    try {
      const isUser = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (isUser) throw new BadRequestException('User already exists');

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: await hash(dto.password),
          userRole: EnumUserRoles.ADMIN,
        },
      });

      if (!user) return null;

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user', error.message);
    }
  }

  async update(userId: number, dto: UpdateUserDto): Promise<IUserReturnInfo | null> {
    try {
      const isUser = await this.findById(userId);

      if (!isUser) throw new NotFoundException('User was not found');

      const updateData: Prisma.UserUpdateInput = {};

      if (dto.name !== undefined) {
        updateData.name = dto.name;
      }

      if (dto.email !== undefined) {
        updateData.email = dto.email;
      }

      if (dto.password !== undefined) {
        updateData.password = await hash(dto.password);
      }

      const updatedItem: User = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: updateData,
      });

      if (!updatedItem) throw new InternalServerErrorException('Error while updating');

      return this.returnUserFields(updatedItem);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user', error.message);
    }
  }

  async findById(userId: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) throw new NotFoundException('User not found');

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find user', error.message);
    }
  }

  async findByEmail(userEmail: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: userEmail,
        },
      });

      if (!user) throw new NotFoundException('User not found');

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to find user', error.message);
    }
  }

  returnUserFields(user: User): IUserReturnInfo {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}
