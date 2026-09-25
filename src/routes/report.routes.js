import { Router } from 'express';
import * as reportController from '../controllers/report.controller.js';

const router = Router();

router.get('/completed', reportController.completedReport);
router.get('/pending', reportController.pendingReport);
router.get('/summary', reportController.summaryReport);

export default router;
