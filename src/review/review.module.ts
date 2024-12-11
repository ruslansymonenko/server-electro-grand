import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';
import { PrismaService } from '../prisma.service';
import { CategoryService } from '../category/category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { FilesService } from '../files/files.service';
import { BrandService } from '../brand/brand.service';

@Module({
  controllers: [ReviewController],
  providers: [
    ReviewService,
    UserService,
    ProductService,
    PrismaService,
    CategoryService,
    SubcategoryService,
    FilesService,
    BrandService,
  ],
})
export class ReviewModule {}
