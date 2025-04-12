import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { authenticate, authorize } from '../middlewares/auth';
import { Roles } from '@prisma/client';
import ValidateRequest from '../middlewares/validate';

const router = express.Router();

router.post('/register', ValidateRequest(registerSchema), AuthController.register);
router.post('/login', ValidateRequest(loginSchema), AuthController.login);
router.get('/me', authenticate, AuthController.getCurrentUser);

router.post(
  '/roles/add',
  authenticate,
  authorize([Roles.ADMIN]),
  AuthController.addRole
);
router.post(
  '/roles/remove',
  authenticate,
  authorize([Roles.ADMIN]),
  AuthController.removeRole
);

export default router;