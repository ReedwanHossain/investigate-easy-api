import { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  error?: string
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    error,
  });
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  error?: string
) => {
  return sendResponse(res, statusCode, false, message, undefined, error);
};