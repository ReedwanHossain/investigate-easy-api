import express from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.use(authenticate);

router.post('/', ReviewController.create);
router.get('/investigator/:investigatorId', ReviewController.getByInvestigator);

export default router;