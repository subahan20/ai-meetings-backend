import { Router } from 'express';
import { getLatestReportHandler } from '../controllers/report.controller.js';

const router = Router();

// Endpoint to get the latest report
// Supporting both /latest and /generate for compatibility with frontend expectations
router.get('/latest', getLatestReportHandler);
router.get('/generate', getLatestReportHandler);

export default router;
