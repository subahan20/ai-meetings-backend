import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import connectDB from './server/config/db.js';

import './server/models/user.js';
import './server/models/meeting.js';
import './server/models/research.js';
import './server/models/report.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/audio', express.static(join(__dirname, 'server/public/audio')));

import meetingRoutes from './server/routes/meeting.routes.js';
app.use('/api/meetings', meetingRoutes);

import aiRoutes from './server/routes/ai.routes.js';
app.use('/api/ai', aiRoutes);

import reportRoutes from './server/routes/report.routes.js';
app.use('/api/reports', reportRoutes);

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});