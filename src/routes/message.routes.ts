import express from 'express';
import { MessageController } from '../controllers/message.controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.use(authenticate);

router.post('/', MessageController.send);
router.get('/:requestId', MessageController.getByRequest);

export default router;