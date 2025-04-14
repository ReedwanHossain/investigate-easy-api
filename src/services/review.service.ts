import prisma from '../utils/prisma';
import { ReviewWithRelations } from '../types/relationTypes'; 
import { RequestStatus } from '@prisma/client';

export const ReviewService = {
  async createReview(
    reviewerId: string,
    requestId: string,
    rating: number,
    comment?: string
  ): Promise<ReviewWithRelations> {
    return prisma.$transaction(async (tx) => {
      const request = await tx.request.findUnique({
        where: { id: requestId },
        include: { investigator: true },
      });

      if (!request || 
          request.status !== RequestStatus.COMPLETED || 
          !request.investigatorId ||
          request.requesterId !== reviewerId) {
        throw new Error('Cannot review this request');
      }

      return tx.review.create({
        data: {
          rating,
          comment,
          reviewerId,
          investigatorId: request.investigatorId,
          requestId,
        },
        include: {
          reviewer: true,
          investigator: true,
          request: true,
        },
      });
    });
  },

  async getReviewsByInvestigator(
    investigatorId: string
  ): Promise<ReviewWithRelations[]> {
    return prisma.review.findMany({
      where: { investigatorId },
      include: {
        reviewer: true,
        investigator: true,
        request: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};