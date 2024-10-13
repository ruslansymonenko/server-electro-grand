import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import slugify from 'slugify';
import { ensureDir, writeFile } from 'fs-extra';
import { path } from 'app-root-path';
import * as nodePath from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';

export interface IFilesService {
  saveFiles(
    files: Express.Multer.File[],
    folder: EnumFoldersNames,
    oldFiles?: string[],
  ): Promise<IFileResponse[]>;
  getUploadPath(folder: EnumFoldersNames): string;
  getFileName(originalName: string): string;
}

export interface IFileResponse {
  url: string;
  name: string;
}

export enum EnumFoldersNames {
  PRODUCTS = 'product',
  CATEGORIES = 'categories',
  SUBCATEGORIES = 'subcategories',
}

@Injectable()
export class FilesService implements IFilesService {
  static defaultAppFilesPaths: string[] = [
    'public/assets/images/category.png',
    'public/assets/images/brand.png',
    'public/assets/images/product.png',
    'public/assets/images/subcategory.png',
  ];

  async saveFiles(
    files: Express.Multer.File[],
    folder: EnumFoldersNames,
    oldFiles?: string[],
  ): Promise<IFileResponse[]> {
    if (!Object.values(EnumFoldersNames).includes(folder)) {
      throw new BadRequestException(`Invalid folder name: ${folder}`);
    }

    if (folder === EnumFoldersNames.CATEGORIES && files.length > 1) {
      throw new BadRequestException('Only one file can be uploaded for avatars.');
    }

    if (folder === EnumFoldersNames.SUBCATEGORIES && files.length > 1) {
      throw new BadRequestException('Only one file can be uploaded for avatars.');
    }

    const uploadPath = this.getUploadPath(folder);

    await ensureDir(uploadPath);

    try {
      if (oldFiles) {
        await this.removeOldImages(oldFiles);
      }

      const response: IFileResponse[] = await Promise.all(
        files.map(async (file) => {
          const fileName = this.getFileName(file.originalname);
          const filePath = `${uploadPath}/${fileName}`;

          await writeFile(filePath, file.buffer);

          return {
            url: filePath.replace(`${path}/`, ''),
            name: fileName,
          };
        }),
      );

      return response;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create WorkoutType', error.message);
    }
  }

  getUploadPath(folder: EnumFoldersNames): string {
    let folderPath = `${path}/public/uploads/${folder}`;

    return folderPath;
  }

  getFileName(originalName: string): string {
    const timestamp = Date.now();
    const uniqueId = uuidv4();
    const extension = originalName.split('.').pop();

    const baseName = slugify(originalName.replace(`.${extension}`, ''), {
      lower: true,
      strict: true,
    });

    return `${baseName}-${timestamp}-${uniqueId}.${extension}`;
  }

  async removeOldImages(oldImagePaths: string[]): Promise<void> {
    await Promise.all(
      oldImagePaths.map((relativePath) => {
        if (!FilesService.defaultAppFilesPaths.includes(relativePath)) {
          const absolutePath = nodePath.join(__dirname, '..', '..', relativePath);
          return fs.unlink(absolutePath);
        }
      }),
    );
  }
}
