import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse, sendErrorResponse } from '../utils/apiResponse';

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name, phone } = req.body;
      const result = await AuthService.register(email, password, name, phone);
      sendResponse(res, 201, true, 'User registered successfully', result);
    } catch (error: any) {
      sendErrorResponse(res, 400, error.message);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password)
      sendResponse(res, 200, true, 'Login successful', result);
    } catch (error: any) {
      sendErrorResponse(res, 401, error.message);
    }
  },

  async addRole(req: Request, res: Response) {
    try {
      const { userId, role } = req.body;
      const user = await AuthService.addRole(userId, role);
      sendResponse(res, 200, true, 'Role added successfully', user);
    } catch (error: any) {
      sendErrorResponse(res, 400, error.message);
    }
  },

  async removeRole(req: Request, res: Response) {
    try {
      const { userId, role } = req.body;
      const user = await AuthService.removeRole(userId, role);
      sendResponse(res, 200, true, 'Role removed successfully', user);
    } catch (error: any) {
      sendErrorResponse(res, 400, error.message);
    }
  },

  async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        sendErrorResponse(res, 401, 'User not authenticated');
      }
      sendResponse(res, 200, true, 'Current user retrieved', req.user);
    } catch (error: any) {
      sendErrorResponse(res, 500, 'Internal server error');
    }
  },
};