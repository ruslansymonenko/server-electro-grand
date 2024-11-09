import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Review, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';
import { ReviewDto, UpdateReviewDto } from './dto/review.dto';
import { IReviewResponse, IReviewUserData } from './review.types';

interface IReviewService {
  create(userId: number, dto: ReviewDto): Promise<IReviewResponse | null>;
  getAll(searchParams?: any): Promise<IReviewResponse[] | null>;
  getById(id: number): Promise<IReviewResponse | null>;
  getByProductId(productId: number): Promise<IReviewResponse[] | null>;
  update(id: number, dto: UpdateReviewDto): Promise<IReviewResponse | null>;
  delete(id: number): Promise<IReviewResponse | null>;
}

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async create(userId: number, dto: ReviewDto): Promise<IReviewResponse | null> {
    try {
      const isUser = await this.userService.findById(userId);
      const isProduct = await this.productService.getById(dto.productId);

      if (!isUser && !isProduct) throw new BadRequestException('User or product was not found');

      const review = await this.prisma.review.create({
        data: {
          text: dto.text ? dto.text : '',
          rating: dto.rating,
          productId: dto.productId,
          userId: userId,
        },
      });

      if (!review) throw new InternalServerErrorException('Error creating review');

      return {
        review: review,
        user: this.getUserFields(isUser),
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAll(searchParams?: any): Promise<IReviewResponse[] | null> {
    try {
      const reviews = await this.prisma.review.findMany({
        include: {
          user: true,
        },
      });

      if (!reviews) throw new InternalServerErrorException('Reviews was not found');

      const response: IReviewResponse[] = reviews.map((item) => ({
        review: {
          id: item.id,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          rating: item.rating,
          text: item.text,
          productId: item.productId,
          userId: item.userId,
        },
        user: {
          id: item.user.id,
          name: item.user.name,
        },
      }));

      return response;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get reviews', error.message);
    }
  }

  async getById(id: number): Promise<IReviewResponse | null> {
    try {
      const item = await this.prisma.review.findUnique({
        where: {
          id: id,
        },
        include: {
          user: true,
        },
      });

      if (!item) throw new NotFoundException('Error getting review');

      return {
        review: {
          id: item.id,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          rating: item.rating,
          text: item.text,
          productId: item.productId,
          userId: item.userId,
        },
        user: {
          id: item.user.id,
          name: item.user.name,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getByProductId(productId: number): Promise<IReviewResponse[]> {
    try {
      const reviews = await this.prisma.review.findMany({
        where: {
          productId: productId,
        },
        include: {
          user: true,
        },
      });

      const response: IReviewResponse[] = reviews.map((item) => ({
        review: {
          id: item.id,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          rating: item.rating,
          text: item.text,
          productId: item.productId,
          userId: item.userId,
        },
        user: {
          id: item.user.id,
          name: item.user.name,
        },
      }));

      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, dto: UpdateReviewDto): Promise<IReviewResponse | null> {
    try {
      const isReview = await this.getById(id);

      if (!isReview) throw new NotFoundException('Review was not found');

      const updateData: Prisma.ReviewUpdateInput = {};

      if (dto.text !== undefined) {
        updateData.text = dto.text;
      }

      if (dto.rating !== undefined) {
        updateData.rating = dto.rating;
      }

      const updatedReview = await this.prisma.review.update({
        where: {
          id: id,
        },
        include: {
          user: true,
        },
        data: updateData,
      });

      if (!updatedReview) throw new InternalServerErrorException('Error while updating review');

      return {
        review: {
          id: updatedReview.id,
          createdAt: updatedReview.createdAt,
          updatedAt: updatedReview.updatedAt,
          rating: updatedReview.rating,
          text: updatedReview.text,
          productId: updatedReview.productId,
          userId: updatedReview.userId,
        },
        user: {
          id: updatedReview.user.id,
          name: updatedReview.user.name,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update review: ${error}`);
    }
  }

  getUserFields(user: User): IReviewUserData {
    return {
      id: user.id,
      name: user.name,
    };
  }

  async delete(id: number): Promise<IReviewResponse | null> {
    try {
      const item = await this.prisma.review.delete({
        where: {
          id: id,
        },
        include: {
          user: true,
        },
      });

      if (!item) throw new InternalServerErrorException('Error deleting review');

      return {
        review: {
          id: item.id,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          rating: item.rating,
          text: item.text,
          productId: item.productId,
          userId: item.userId,
        },
        user: {
          id: item.user.id,
          name: item.user.name,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete review', error.message);
    }
  }
}
