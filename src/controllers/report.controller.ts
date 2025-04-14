import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';
import { sendResponse, sendErrorResponse } from '../utils/apiResponse';

export const ReportController = {
  async submit(req: Request, res: Response) {
    try {
      const { content, requestId } = req.body;
      const report = await ReportService.submitReport(
        req.user!.id,
        requestId,
        content
      );
      sendResponse(res, 201, true, 'Report submitted', report);
    } catch (error: any) {
      sendErrorResponse(res, 400, error.message);
    }
  },

  async getByRequest(req: Request, res: Response) {
    try {
      const report = await ReportService.getReportByRequestId(
        req.params.requestId,
        req.user!.id
      );
      if (!report) {
        sendErrorResponse(res, 404, 'Report not found');
      }
      sendResponse(res, 200, true, 'Report retrieved', report);
    } catch (error: any) {
      sendErrorResponse(res, 403, error.message);
    }
  },
};