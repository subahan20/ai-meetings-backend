import { Router } from 'express';
import { createMeetingHandler, getMeetingsHandler } from '../controllers/meeting.controller.js';

const router = Router();

router.post('/', createMeetingHandler);
router.get('/', getMeetingsHandler);

export default router;
