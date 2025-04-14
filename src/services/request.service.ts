import prisma from '../utils/prisma';
import { Request, RequestStatus, Roles } from '@prisma/client';
import { RequestWithRelations } from '../types/relationTypes';

export const RequestService = {
  async createRequest(
    requesterId: string,
    title: string,
    description: string,
    location: string
  ): Promise<Request> {
    return prisma.request.create({
      data: {
        title,
        description,
        location,
        requesterId,
        status: RequestStatus.CREATED,
      },
      include: {
        requester: true,
        investigator: true,
        messages: true,
        report: true,
        reviews: true,
      },
    });
  },

  async getRequestById(requestId: string): Promise<Request | null> {
     
    const request = prisma.request.findUnique({
      where: { id: requestId },
      include: {
        requester: true,
        investigator: true,
        messages: true,
        report: true,
        reviews: true,
      },
    });
    return request
  },

  async getRequestsByUser(userId: string): Promise<Request[]> {
    return prisma.request.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { investigatorId: userId },
        ],
      },
      include: {
        requester: true,
        investigator: true,
        messages: true,
        report: true,
        reviews: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getAvailableRequests(location?: string): Promise<Request[]> {
    return prisma.request.findMany({
      where: {
        status: RequestStatus.CREATED,
        ...(location && { location: { contains: location, mode: 'insensitive' } }),
      },
      include: {
        requester: true,
        investigator: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async acceptRequest(
    investigatorId: string,
    requestId: string
  ): Promise<Request> {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: investigatorId },
      });

      if (!user?.roles.includes(Roles.INVESTIGATOR)) {
        throw new Error('User is not an investigator');
      }

      const existingRequest = await tx.request.findUnique({
        where: { id: requestId },
      });
      
      if (!existingRequest) {
        throw new Error('Request not found');
      }
      if (existingRequest.status !== RequestStatus.CREATED) {
        throw new Error('Request cannot be accepted - Its  already taken');
      }

      if(existingRequest.requesterId === user.id) {
        throw new Error('Requester Cannot accept own Case');
      
      }

      return tx.request.update({
        where: { id: requestId },
        data: {
          investigatorId,
          status: RequestStatus.IN_PROGRESS,
        },
        include: {
          requester: true,
          investigator: true,
        },
      });
    });
  },

  async updateRequestStatus(
    requestId: string,
    status: RequestStatus
  ): Promise<Request> {
    return prisma.request.update({
      where: { id: requestId },
      data: { status },
      include: {
        requester: true,
        investigator: true,
      },
    });
  },

   async  getRequestsByInvestigatorId(investigatorId: string): Promise<Request[]> {
    const results = prisma.request.findMany({
      where: {
        investigatorId: investigatorId
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        requester: true,
        investigator: true,
        messages: true,
        report: true,
        reviews: true,
      },
    });
    return results
  },

  async getRequestsByRequesterId(requesterId: string): Promise<Request[]> {
    const results = prisma.request.findMany({
      where: {
        requesterId: requesterId
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        requester: true,
        investigator: true,
        messages: true,
        report: true,
        reviews: true,
      },
    });
    return results
  }

};

