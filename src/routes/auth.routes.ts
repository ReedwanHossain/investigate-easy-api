import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { registerSchema, loginSchema, updateUserInfo } from '../validations/auth.validation';
import { authenticate, authorize } from '../middlewares/auth';
import { Roles } from '@prisma/client';
import ValidateRequest from '../middlewares/validate';

const router = express.Router();

router.post('/register', ValidateRequest(registerSchema), AuthController.register);
router.post('/login', ValidateRequest(loginSchema), AuthController.login);


// TODO: Move below routes from auth to separate module
router.get('/user', authenticate, AuthController.getCurrentUser);
router.patch('/user/update', ValidateRequest(updateUserInfo), authenticate, AuthController.updateUserInfo);


export default router;