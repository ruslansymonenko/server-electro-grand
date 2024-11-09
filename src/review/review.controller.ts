import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { EnumUserRoles } from '@prisma/client';
import { ReviewDto, UpdateReviewDto } from './dto/review.dto';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post('')
  async create(@Body() dto: ReviewDto, @CurrentUser('id') userId: number) {
    return this.reviewService.create(userId, dto);
  }

  @HttpCode(200)
  @Get('')
  async getAll(@Query() searchParams: any) {
    return this.reviewService.getAll(searchParams);
  }

  @HttpCode(200)
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.reviewService.getById(parseInt(id));
  }

  @HttpCode(200)
  @Get('by-productId/:id')
  async getByProductId(@Param('id') id: string) {
    return this.reviewService.getByProductId(parseInt(id));
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Put('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewService.update(parseInt(id), dto);
  }

  @HttpCode(200)
  @Auth(EnumUserRoles.ADMIN)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.reviewService.delete(parseInt(id));
  }
}
