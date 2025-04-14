import prisma from '../utils/prisma';
import { ReportWithInvestigator } from '../types/relationTypes'; 
import { Report, RequestStatus } from '@prisma/client';

export const ReportService = {
  async submitReport(
    investigatorId: string,
    requestId: string,
    content: string
  ): Promise<Report> {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
    });
  
    if (!request) {
      throw new Error('Request not found');
    }
  
    if (request.investigatorId !== investigatorId) {
      throw new Error('Unauthorized to submit report for this request');
    }
  
    if (request.status !== RequestStatus.IN_PROGRESS) {
      throw new Error('Cannot submit report for a request that is not in progress');
    }
  
    // Create the report first
    const report = await prisma.report.create({
      data: {
        content,
        requestId,
        investigatorId,
      },
      include: {
        investigator: true,
      },
    });
  
    // Then update the request status
    await prisma.request.update({
      where: { id: requestId },
      data: { status: RequestStatus.COMPLETED },
    });
  
    return report;
  },

  async getReportByRequestId(
    requestId: string,
    userId: string
  ): Promise<Report | null> {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      select: { requesterId: true, investigatorId: true },
    });

    if (!request || 
        (request.requesterId !== userId && request.investigatorId !== userId)) {
      throw new Error('Unauthorized to view this report');
    }

    return prisma.report.findUnique({
      where: { requestId },
      include: {
        investigator: true,
      },
    });
  },
};