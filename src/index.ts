import express from 'express';
import cors from 'cors';
import { Logger } from './utils/Logger';
import predictionRouter from './api/PredictionAPI';

const app = express();
const logger = new Logger('App');
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/predictions', predictionRouter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy' });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error', err);
  res.status(500).json({
    error: 'Internal server error'
  });
});

// Start server
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
}); 