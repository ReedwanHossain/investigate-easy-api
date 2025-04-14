import express from 'express';
import { ReportController } from '../controllers/report.controller';
import { authenticate } from '../middlewares/auth';
import { authorize } from '../middlewares/auth';

const router = express.Router();

router.use(authenticate);
router.use(authorize(['INVESTIGATOR']));

router.post('/', ReportController.submit);
router.get('/:requestId', ReportController.getByRequest);

export default router;