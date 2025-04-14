import { Request, Response } from 'express';
import { RequestService } from '../services/request.service';
import { sendResponse, sendErrorResponse } from '../utils/apiResponse';

export const RequestController = {
  async create(req: Request, res: Response) {
    try {
      const { title, description, location } = req.body;
      const request = await RequestService.createRequest(
        req.user!.id,
        title,
        description,
        location
      );
      sendResponse(res, 201, true, 'Request created successfully', request);
    } catch (error: any) {
      sendErrorResponse(res, 400, error.message);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const request = await RequestService.getRequestById(req.params.id);
      if (!request) {
         sendErrorResponse(res, 404, 'Request not found');
      }
      sendResponse(res, 200, true, 'Request retrieved', request);
    } catch (error: any) {
      sendErrorResponse(res, 500, error.message);
    }
  },

  async getUserRequests(req: Request, res: Response) {
    try {
      const requests = await RequestService.getRequestsByUser(req.user!.id);
      sendResponse(res, 200, true, 'User requests retrieved', requests);
    } catch (error: any) {
      sendErrorResponse(res, 500, error.message);
    }
  },

  async getAvailableRequests(req: Request, res: Response) {
    try {
      const requests = await RequestService.getAvailableRequests(
        req.query.location as string | undefined
      );
      sendResponse(res, 200, true, 'Available requests retrieved', requests);
    } catch (error: any) {
      sendErrorResponse(res, 500, error.message);
    }
  },

  async acceptRequest(req: Request, res: Response) {
    try {
      const request = await RequestService.acceptRequest(
        req.user!.id,
        req.params.id
      );
      sendResponse(res, 200, true, 'Request accepted', request);
    } catch (error: any) {
      sendErrorResponse(res, 400, error.message);
    }
  },

  async updateStatus(req: Request, res: Response) {
    try {
      const request = await RequestService.updateRequestStatus(
        req.params.id,
        req.body.status
      );
      sendResponse(res, 200, true, 'Request status updated', request);
    } catch (error: any) {
      sendErrorResponse(res, 400, error.message);
    }
  },


  async getRequestsByInvestigatorId(req: Request, res: Response) {
    try {
      const requests = await RequestService.getRequestsByInvestigatorId(req.params.id);
      if (!requests) {
         sendErrorResponse(res, 404, 'Requests not found');
      }
      sendResponse(res, 200, true, 'Requests by Investigator retrieved', requests);
    } catch (error: any) {
      sendErrorResponse(res, 500, error.message);
    }
  },

  async getRequestsByRequesterId(req: Request, res: Response) {
    try {
      const requests = await RequestService.getRequestsByRequesterId(req.params.id);
      if (!requests) {
         sendErrorResponse(res, 404, 'Requests not found');
      }
      sendResponse(res, 200, true, 'All request by the creator retrieved', requests);
    } catch (error: any) {
      sendErrorResponse(res, 500, error.message);
    }
  },



};