import { Request, Response } from 'express';
import { MessageService } from '../services/message.service';
import { sendResponse, sendErrorResponse } from '../utils/apiResponse';

export const MessageController = {
  async send(req: Request, res: Response) {
    try {
      const { content, requestId } = req.body;
      const message = await MessageService.sendMessage(
        req.user!.id,
        requestId,
        content
      );
      sendResponse(res, 201, true, 'Message sent', message);
    } catch (error: any) {
      sendErrorResponse(res, 400, error.message);
    }
  },

  async getByRequest(req: Request, res: Response) {
    try {
      const messages = await MessageService.getMessagesByRequest(
        req.params.requestId,
        req.user!.id
      );
      sendResponse(res, 200, true, 'Messages retrieved', messages);
    } catch (error: any) {
      sendErrorResponse(res, 403, error.message);
    }
  },
};