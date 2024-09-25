import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { createSlug } from '../utils/create-slug/create-slug';

interface ICategoryService {
  create(dto: CategoryDto): Promise<Category | null>;
  getAll(searchParams?: any): Promise<Category[] | null>;
  getById(id: number): Promise<Category | null>;
  getBySlug(slug: string): Promise<Category | null>;
  update(id: number, dto: UpdateCategoryDto): Promise<Category | null>;
}

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CategoryDto): Promise<Category | null> {
    const categorySlug: string = createSlug(dto.name);

    try {
      const category = await this.prisma.category.create({
        data: {
          name: dto.name,
          slug: categorySlug,
        },
      });

      if (!category) throw new InternalServerErrorException('Error creating category');

      return category;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAll(searchParams?: any): Promise<Category[] | null> {
    try {
      const tags = await this.prisma.category.findMany({});

      if (!tags) throw new InternalServerErrorException('Categories was not found');

      return tags;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get categories', error.message);
    }
  }

  async getById(id: number): Promise<Category | null> {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          id: id,
        },
      });

      if (!category) throw new NotFoundException('Error getting category');

      return category;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getBySlug(slug: string): Promise<Category | null> {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          slug: slug,
        },
      });

      if (!category) throw new NotFoundException('Error getting category');

      return category;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category | null> {
    try {
      const isCategory = await this.getById(id);

      if (!isCategory) throw new NotFoundException('Category was not found');

      const updateData: Prisma.CategoryUpdateInput = {};

      if (dto.name !== undefined) {
        updateData.name = dto.name;
      }

      if (dto.slug !== undefined) {
        updateData.slug = dto.slug;
      }

      const updatedCategory = await this.prisma.category.update({
        where: {
          id: id,
        },
        data: updateData,
      });

      if (!updatedCategory) throw new InternalServerErrorException('Error while updating category');

      return updatedCategory;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update category: ${error}`);
    }
  }

  async delete(id: number): Promise<Category | null> {
    try {
      const category = await this.prisma.category.delete({
        where: {
          id: id,
        },
      });

      if (!category) throw new InternalServerErrorException('Error deleting category');

      return category;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete category', error.message);
    }
  }
}
