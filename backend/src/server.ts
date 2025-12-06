import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import casesRouter from './routes/cases';
import proceduresRouter from './routes/procedures';
import aiRouter from './routes/ai';
import researchRouter from './routes/research';
import { requestLogger, errorLogger } from './middleware/requestLogger';
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/cases', casesRouter);
app.use('/api/procedures', proceduresRouter);
app.use('/api/ai', aiRouter);
app.use('/api/research', researchRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware (must be last)
app.use(errorLogger);

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

