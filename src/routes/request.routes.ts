import express from 'express';
import { RequestController } from '../controllers/request.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { Roles } from '@prisma/client';

const router = express.Router();

router.use(authenticate);

router.post('/', RequestController.create);
router.get('/', RequestController.getUserRequests);
router.get('/available', authorize([Roles.INVESTIGATOR]), RequestController.getAvailableRequests);
router.get('/investigator/:id', authorize([Roles.INVESTIGATOR]), RequestController.getRequestsByInvestigatorId);
router.get('/requester/:id', authorize([Roles.REQUESTER]), RequestController.getRequestsByRequesterId);
router.get('/:id', RequestController.getById);
router.patch('/:id/accept', authorize([Roles.INVESTIGATOR]), RequestController.acceptRequest);
router.patch('/:id/status', RequestController.updateStatus);

export default router;