import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ProductAttribute } from '@prisma/client';
import { ProductAttributeDto, UpdateProductAttributeDto } from './dto/product-attribute.dto';
import { PrismaService } from '../database/prisma.service';
import { AttributeService } from '../attribute/attribute.service';
import { ProductService } from '../product/product.service';
import { AttributeValueService } from '../attribute-value/attribute-value.service';

interface IProductAttributeService {
  create(dto: ProductAttributeDto): Promise<ProductAttribute | null>;
  getByProductId(productId: number): Promise<ProductAttribute[] | null>;
  update(id: number, dto: UpdateProductAttributeDto): Promise<ProductAttribute | null>;
  delete(id: number): Promise<ProductAttribute | null>;
}

@Injectable()
export class ProductAttributeService implements IProductAttributeService {
  constructor(
    private prisma: PrismaService,
    private attributeValueService: AttributeValueService,
    private productService: ProductService,
  ) {}

  async create(dto: ProductAttributeDto): Promise<ProductAttribute | null> {
    try {
      const isAttributeValue = await this.attributeValueService.getById(dto.attributeValueId);
      if (!isAttributeValue) throw new BadRequestException('Attribute value was not found');

      const isProduct = await this.productService.getById(dto.productId);
      if (!isProduct) throw new BadRequestException('Product was not found');

      const productAttribute = await this.prisma.productAttribute.create({
        data: {
          productId: dto.productId,
          attributeValueId: dto.attributeValueId,
        },
      });

      if (!productAttribute)
        throw new InternalServerErrorException('Error creating product' + ' attribute');

      return productAttribute;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getByProductId(productId: number): Promise<ProductAttribute[] | null> {
    try {
      const productAttributes = await this.prisma.productAttribute.findMany({
        where: {
          productId: productId,
        },
      });

      if (!productAttributes)
        throw new InternalServerErrorException('product attribute value' + ' was not' + ' found');

      return productAttributes;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get product attributes', error.message);
    }
  }

  async update(id: number, dto: UpdateProductAttributeDto): Promise<ProductAttribute | null> {
    try {
      const isAttributeValue = await this.attributeValueService.getById(dto.attributeValueId);
      if (!isAttributeValue) throw new BadRequestException('Attribute value was not found');

      const isProduct = await this.productService.getById(dto.productId);
      if (!isProduct) throw new BadRequestException('Product was not found');

      const updateData: Prisma.ProductAttributeUpdateInput = {};

      if (dto.productId !== undefined) {
        updateData.product = {
          connect: { id: dto.productId },
        };
      }

      if (dto.attributeValueId !== undefined) {
        updateData.attributeValue = {
          connect: { id: dto.attributeValueId },
        };
      }

      const updatedProductAttribute = await this.prisma.productAttribute.update({
        where: {
          id: id,
        },
        data: updateData,
      });

      if (!updatedProductAttribute)
        throw new InternalServerErrorException('Error while updating product attribute');

      return updatedProductAttribute;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update product attribute: ${error}`);
    }
  }

  async delete(id: number): Promise<ProductAttribute | null> {
    try {
      const productAttribute = await this.prisma.productAttribute.delete({
        where: {
          id: id,
        },
      });

      if (!productAttribute)
        throw new InternalServerErrorException('Error deleting product' + ' attribute');

      return productAttribute;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete product attribute', error.message);
    }
  }
}
