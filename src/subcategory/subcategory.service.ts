import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Category, Prisma, Subcategory } from '@prisma/client';
import { createSlug } from '../utils/create-slug/create-slug';
import { SubcategoryDto, UpdateSubcategoryDto } from './dto/subcategory.dto';
import { CategoryService } from '../category/category.service';
import { EnumFoldersNames, FilesService, IFileResponse } from '../files/files.service';

interface ISubcategoryService {
  create(dto: SubcategoryDto): Promise<Subcategory | null>;
  setSubcategoryImage(id: number, image: Express.Multer.File[]): Promise<Category | null>;
  getAll(searchParams?: any): Promise<Subcategory[] | null>;
  getById(id: number): Promise<Subcategory | null>;
  getBySlug(slug: string): Promise<Subcategory | null>;
  update(id: number, dto: UpdateSubcategoryDto): Promise<Subcategory | null>;
  delete(id: number): Promise<Subcategory | null>;
  checkSubcategoryInCategory(subcategoryId: number, categoryId: number): Promise<boolean>;
}

@Injectable()
export class SubcategoryService implements ISubcategoryService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
    private filesService: FilesService,
  ) {}

  async create(dto: SubcategoryDto): Promise<Subcategory | null> {
    try {
      const isCategory = await this.categoryService.getById(dto.categoryId);

      if (!isCategory) throw new BadRequestException('Category not found');

      const subcategorySlug: string = createSlug(dto.name);

      const subcategory = await this.prisma.subcategory.create({
        data: {
          name: dto.name,
          slug: subcategorySlug,
          categoryId: dto.categoryId,
        },
      });

      if (!subcategory) throw new InternalServerErrorException('Error creating subcategory');

      return subcategory;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async setSubcategoryImage(id: number, image: Express.Multer.File[]): Promise<Category | null> {
    try {
      const currentSubcategory = await this.prisma.subcategory.findUnique({
        where: { id: id },
        select: { image: true },
      });

      if (!currentSubcategory) throw new NotFoundException('Subcategory not found');

      const oldImagePath: string = currentSubcategory.image;

      const filesData: IFileResponse[] = await this.filesService.saveFiles(
        [image[0]],
        EnumFoldersNames.SUBCATEGORIES,
        [oldImagePath],
      );
      const imagesPath: string = filesData.map((file) => file.url)[0];

      const updatedSubcategory = await this.prisma.subcategory.update({
        where: {
          id: id,
        },
        data: {
          image: imagesPath,
        },
      });

      if (!updatedSubcategory)
        throw new InternalServerErrorException('Error updating subcategory' + ' images');

      return updatedSubcategory;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getAll(searchParams?: any): Promise<Subcategory[] | null> {
    try {
      const subcategories = await this.prisma.subcategory.findMany({});

      if (!subcategories) throw new InternalServerErrorException('Subcategories was not found');

      return subcategories;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get subcategories', error.message);
    }
  }

  async getById(id: number): Promise<Subcategory | null> {
    try {
      const subcategory = await this.prisma.subcategory.findUnique({
        where: {
          id: id,
        },
      });

      if (!subcategory) throw new NotFoundException('Error getting subcategory');

      return subcategory;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getBySlug(slug: string): Promise<Subcategory | null> {
    try {
      const subcategory = await this.prisma.subcategory.findUnique({
        where: {
          slug: slug,
        },
      });

      if (!subcategory) throw new NotFoundException('Error getting subcategory');

      return subcategory;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, dto: UpdateSubcategoryDto): Promise<Subcategory | null> {
    try {
      const isCategory = await this.categoryService.getById(dto.categoryId);

      if (!isCategory) throw new BadRequestException('Category not found');

      const isSubcategory = await this.getById(id);

      if (!isSubcategory) throw new NotFoundException('Category was not found');

      const updateData: Prisma.SubcategoryUpdateInput = {};

      if (dto.name !== undefined) {
        updateData.name = dto.name;
        updateData.slug = createSlug(dto.name);
      }

      if (dto.slug !== undefined) {
        updateData.slug = dto.slug;
      }

      if (dto.categoryId !== undefined) {
        updateData.category = {
          connect: { id: dto.categoryId },
        };
      }

      const updatedSubcategory = await this.prisma.subcategory.update({
        where: {
          id: id,
        },
        data: updateData,
      });

      if (!updatedSubcategory)
        throw new InternalServerErrorException('Error while updating' + ' subcategory');

      return updatedSubcategory;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update subcategory: ${error}`);
    }
  }

  async delete(id: number): Promise<Subcategory | null> {
    try {
      const subcategory = await this.prisma.subcategory.delete({
        where: {
          id: id,
        },
      });

      await this.filesService.removeOldImages([subcategory.image]);

      if (!subcategory) throw new InternalServerErrorException('Error deleting subcategory');

      return subcategory;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete subcategory', error.message);
    }
  }

  async checkSubcategoryInCategory(subcategoryId: number, categoryId: number): Promise<boolean> {
    const isSubcategoryInCategory = await this.prisma.subcategory.findFirst({
      where: {
        id: subcategoryId,
        categoryId: categoryId,
      },
    });

    return !!isSubcategoryInCategory;
  }
}
