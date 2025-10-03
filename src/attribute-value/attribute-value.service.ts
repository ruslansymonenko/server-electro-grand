import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AttributeValue, Prisma } from '@prisma/client';
import { AttributeValueDto, UpdateAttributeValueDto } from './dto/attribute-value.dto';
import { PrismaService } from '../database/prisma.service';
import { AttributeService } from '../attribute/attribute.service';

interface IAttributeValueService {
  create(dto: AttributeValueDto): Promise<AttributeValue | null>;
  getAll(searchParams?: any): Promise<AttributeValue[] | null>;
  getByAttribute(searchParams?: any): Promise<AttributeValue[] | null>;
  getById(id: number): Promise<AttributeValue | null>;
  update(id: number, dto: UpdateAttributeValueDto): Promise<AttributeValue | null>;
  delete(id: number): Promise<AttributeValue | null>;
}

@Injectable()
export class AttributeValueService {
  constructor(
    private prisma: PrismaService,
    private attributeService: AttributeService,
  ) {}

  async create(dto: AttributeValueDto): Promise<AttributeValue | null> {
    try {
      const isAttribute = await this.attributeService.getById(dto.attributeId);

      if (!isAttribute) throw new BadRequestException('Attribute was not found');

      const attributeValue = await this.prisma.attributeValue.create({
        data: {
          value: dto.value,
          attributeId: dto.attributeId,
        },
      });

      if (!attributeValue) throw new InternalServerErrorException('Error creating attribute');

      return attributeValue;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAll(searchParams?: any): Promise<AttributeValue[] | null> {
    try {
      const attributeValues = await this.prisma.attributeValue.findMany({});

      if (!attributeValues) throw new InternalServerErrorException('attribute value was not found');

      return attributeValues;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get attribute values', error.message);
    }
  }

  async getById(id: number): Promise<AttributeValue | null> {
    try {
      const attributeValue = await this.prisma.attributeValue.findUnique({
        where: {
          id: id,
        },
      });

      if (!attributeValue) throw new NotFoundException('Error getting attribute value');

      return attributeValue;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, dto: AttributeValueDto): Promise<AttributeValue | null> {
    try {
      const isAttributeValue = await this.getById(id);

      if (!isAttributeValue) throw new NotFoundException('Attribute value was not found');

      if (dto.attributeId) {
        const isAttribute = await this.attributeService.getById(dto.attributeId);

        if (!isAttribute) throw new NotFoundException('Attribute value was not found');
      }

      const updateData: Prisma.AttributeValueUpdateInput = {};

      if (dto.value !== undefined) {
        updateData.value = dto.value;
      }

      if (dto.attributeId !== undefined) {
        const isAttribute = await this.attributeService.getById(dto.attributeId);

        if (!isAttribute) throw new NotFoundException('Attribute value was not found');

        updateData.attribute = {
          connect: { id: dto.attributeId },
        };
      }

      const updatedAttributeValue = await this.prisma.attributeValue.update({
        where: {
          id: id,
        },
        data: updateData,
      });

      if (!updatedAttributeValue)
        throw new InternalServerErrorException('Error while updating attribute value');

      return updatedAttributeValue;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update attribute value: ${error}`);
    }
  }

  async delete(id: number): Promise<AttributeValue | null> {
    try {
      const attribute = await this.prisma.attributeValue.delete({
        where: {
          id: id,
        },
      });

      if (!attribute) throw new InternalServerErrorException('Error deleting attribute value');

      return attribute;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete attribute value', error.message);
    }
  }
}
