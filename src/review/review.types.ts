import { Review } from '@prisma/client';

export interface IReviewUserData {
  id: number;
  name: string;
}

export interface IReviewResponse {
  review: Review;
  user: IReviewUserData;
}
