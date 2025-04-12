import  { Request, Response, NextFunction } from "express";
import { type z, ZodError } from "zod";
import { sendErrorResponse } from "../utils/apiResponse";
import { fromZodError } from "zod-validation-error";

const ValidateRequest = (validationSchema: z.Schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      validationSchema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
       sendErrorResponse(
         _res,
         400,
         'Validation Failed!',
         validationError.message
       );
      }
      next(err)
    }
  };
};
export default ValidateRequest;
