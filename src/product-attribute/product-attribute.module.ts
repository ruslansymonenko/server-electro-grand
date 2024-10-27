import { Module } from '@nestjs/common';
import { ProductAttributeService } from './product-attribute.service';
import { ProductAttributeController } from './product-attribute.controller';
import { PrismaService } from '../prisma.service';
import { ProductService } from '../product/product.service';
import { AttributeValueService } from '../attribute-value/attribute-value.service';
import { CategoryService } from '../category/category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { FilesService } from '../files/files.service';
import { BrandService } from '../brand/brand.service';
import { AttributeService } from '../attribute/attribute.service';

@Module({
  controllers: [ProductAttributeController],
  providers: [
    ProductAttributeService,
    PrismaService,
    ProductService,
    AttributeValueService,
    CategoryService,
    SubcategoryService,
    FilesService,
    BrandService,
    AttributeService,
  ],
})
export class ProductAttributeModule {}
