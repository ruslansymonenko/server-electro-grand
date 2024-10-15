import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Brand, Category, Prisma } from '@prisma/client';
import { BrandDto, UpdateBrandDto } from './dto/brand.dto';
import { PrismaService } from '../prisma.service';
import { createSlug } from '../utils/create-slug/create-slug';
import { EnumFoldersNames, FilesService, IFileResponse } from '../files/files.service';

interface IBrandService {
  create(dto: BrandDto): Promise<Brand | null>;
  getAll(searchParams?: any): Promise<Brand[] | null>;
  getById(id: number): Promise<Brand | null>;
  getBySlug(slug: string): Promise<Brand | null>;
  update(id: number, dto: UpdateBrandDto): Promise<Brand | null>;
  delete(id: number): Promise<Brand | null>;
}

@Injectable()
export class BrandService implements IBrandService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  async create(dto: BrandDto): Promise<Brand | null> {
    const brandSlug: string = createSlug(dto.name);

    try {
      const brand = await this.prisma.brand.create({
        data: {
          name: dto.name,
          slug: brandSlug,
        },
      });

      if (!brand) throw new InternalServerErrorException('Error creating brand');

      return brand;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async setBrandImage(id: number, image: Express.Multer.File[]): Promise<Category | null> {
    try {
      const currentBrand = await this.prisma.brand.findUnique({
        where: { id: id },
        select: { image: true },
      });

      if (!currentBrand) throw new NotFoundException('Category not found');

      const oldImagePath: string = currentBrand.image;

      const filesData: IFileResponse[] = await this.filesService.saveFiles(
        [image[0]],
        EnumFoldersNames.BRANDS,
        [oldImagePath],
      );
      const imagesPath: string = filesData.map((file) => file.url)[0];

      const updatedBrand = await this.prisma.brand.update({
        where: {
          id: id,
        },
        data: {
          image: imagesPath,
        },
      });

      if (!updatedBrand) throw new InternalServerErrorException('Error updating brand' + ' images');

      return updatedBrand;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getAll(searchParams?: any): Promise<Brand[] | null> {
    try {
      const brands = await this.prisma.brand.findMany({});

      if (!brands) throw new InternalServerErrorException('Brands was not found');

      return brands;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get brands', error.message);
    }
  }

  async getById(id: number): Promise<Brand | null> {
    try {
      const brand = await this.prisma.brand.findUnique({
        where: {
          id: id,
        },
        include: {
          products: true,
        },
      });

      if (!brand) throw new NotFoundException('Error getting brand');

      return brand;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getBySlug(slug: string): Promise<Category | null> {
    try {
      const brand = await this.prisma.brand.findUnique({
        where: {
          slug: slug,
        },
        include: {
          products: true,
        },
      });

      if (!brand) throw new NotFoundException('Error getting brand');

      return brand;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, dto: UpdateBrandDto): Promise<Brand | null> {
    try {
      const isBrand = await this.getById(id);

      if (!isBrand) throw new NotFoundException('Brand was not found');

      const updateData: Prisma.BrandUpdateInput = {};

      if (dto.name !== undefined) {
        updateData.name = dto.name;
        updateData.slug = createSlug(dto.name);
      }

      if (dto.slug !== undefined) {
        updateData.slug = dto.slug;
      }

      const updatedBrand = await this.prisma.category.update({
        where: {
          id: id,
        },
        data: updateData,
      });

      if (!updatedBrand) throw new InternalServerErrorException('Error while updating brand');

      return updatedBrand;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update brand: ${error}`);
    }
  }

  async delete(id: number): Promise<Brand | null> {
    try {
      const brand = await this.prisma.brand.delete({
        where: {
          id: id,
        },
      });

      await this.filesService.removeOldImages([brand.image]);

      if (!brand) throw new InternalServerErrorException('Error deleting brand');

      return brand;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete brand', error.message);
    }
  }
}
