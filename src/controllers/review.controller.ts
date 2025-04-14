import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service';
import { sendResponse, sendErrorResponse } from '../utils/apiResponse';

export const ReviewController = {
  async create(req: Request, res: Response) {
    try {
      const { rating, comment, requestId } = req.body;
      const review = await ReviewService.createReview(
        req.user!.id,
        requestId,
        rating,
        comment
      );
      sendResponse(res, 201, true, 'Review created', review);
    } catch (error: any) {
      sendErrorResponse(res, 400, error.message);
    }
  },

  async getByInvestigator(req: Request, res: Response) {
    try {
      const reviews = await ReviewService.getReviewsByInvestigator(
        req.params.investigatorId
      );
      sendResponse(res, 200, true, 'Reviews retrieved', reviews);
    } catch (error: any) {
      sendErrorResponse(res, 500, error.message);
    }
  },
};