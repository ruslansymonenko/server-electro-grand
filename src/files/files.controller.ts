import {
  Controller,
  HttpCode,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { EnumFoldersNames, FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../auth/decorators/auth.decorator';
import { EnumUserRoles } from '@prisma/client';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @HttpCode(200)
  @UseInterceptors(FileInterceptor('files'))
  @Auth(EnumUserRoles.ADMIN)
  @Post('upload')
  async saveFiles(
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder: EnumFoldersNames,
  ) {
    return this.filesService.saveFiles(files, folder);
  }
}
