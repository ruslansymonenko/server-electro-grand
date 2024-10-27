import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Attribute, Prisma } from '@prisma/client';
import { AttributeDto, UpdateAttributeDto } from './dto/attribute.dto';
import { PrismaService } from '../prisma.service';

interface IAttributeService {
  create(dto: AttributeDto): Promise<Attribute | null>;
  getAll(searchParams?: any): Promise<Attribute[] | null>;
  getById(id: number): Promise<Attribute | null>;
  update(id: number, dto: UpdateAttributeDto): Promise<Attribute | null>;
  delete(id: number): Promise<Attribute | null>;
}

@Injectable()
export class AttributeService implements IAttributeService {
  constructor(private prisma: PrismaService) {}

  async create(dto: AttributeDto): Promise<Attribute | null> {
    try {
      const attribute = await this.prisma.attribute.create({
        data: {
          name: dto.name,
        },
      });

      if (!attribute) throw new InternalServerErrorException('Error creating attribute');

      return attribute;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAll(searchParams?: any): Promise<Attribute[] | null> {
    try {
      const attributes = await this.prisma.attribute.findMany({
        include: {
          values: true,
        },
      });

      if (!attributes) throw new InternalServerErrorException('Attribute was not found');

      return attributes;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get attributes', error.message);
    }
  }

  async getById(id: number): Promise<Attribute | null> {
    try {
      const attribute = await this.prisma.attribute.findUnique({
        where: {
          id: id,
        },
        include: {
          values: true,
        },
      });

      if (!attribute) throw new NotFoundException('Error getting attribute');

      return attribute;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, dto: UpdateAttributeDto): Promise<Attribute | null> {
    try {
      const isAttribute = await this.getById(id);

      if (!isAttribute) throw new NotFoundException('Attribute was not found');

      const updateData: Prisma.AttributeUpdateInput = {};

      if (dto.name !== undefined) {
        updateData.name = dto.name;
      }

      const updatedAttribute = await this.prisma.attribute.update({
        where: {
          id: id,
        },
        data: updateData,
      });

      if (!updatedAttribute)
        throw new InternalServerErrorException('Error while updating attribute');

      return updatedAttribute;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update attribute: ${error}`);
    }
  }

  async delete(id: number): Promise<Attribute | null> {
    try {
      const attribute = await this.prisma.attribute.delete({
        where: {
          id: id,
        },
      });

      if (!attribute) throw new InternalServerErrorException('Error deleting attribute');

      return attribute;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete attribute', error.message);
    }
  }
}
