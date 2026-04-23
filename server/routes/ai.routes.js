import { Router } from 'express';
import { processMeetingHandler } from '../controllers/ai.controller.js';

const router = Router();

router.post('/process-meeting', processMeetingHandler);

export default router;
