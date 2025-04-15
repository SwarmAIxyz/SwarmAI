import express, { Request, Response } from 'express';
import { PredictionEngine } from '../core/PredictionEngine';
import { MarketData } from '../types/PredictionTypes';
import { Logger } from '../utils/Logger';

const router = express.Router();
const predictionEngine = new PredictionEngine();
const logger = new Logger('PredictionAPI');

// Get prediction for market data
router.post('/predict', async (req: Request, res: Response) => {
  try {
    const marketData: MarketData = req.body;
    
    // Validate request data
    if (!marketData || !marketData.price || !marketData.volume) {
      return res.status(400).json({
        error: 'Invalid market data provided'
      });
    }

    // Generate prediction
    const prediction = await predictionEngine.generatePredictions(marketData);
    
    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    logger.error('Error generating prediction', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Get model performance metrics
router.get('/models/performance', async (_req: Request, res: Response) => {
  try {
    const models = await predictionEngine.getModelRegistry().getActiveModels();
    const performance = models.map(model => ({
      id: model.id,
      name: model.name,
      performance: model.performance,
      weight: model.weight
    }));

    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    logger.error('Error fetching model performance', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Update model weights
router.post('/models/:modelId/weight', async (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;
    const { performance } = req.body;

    if (typeof performance !== 'number') {
      return res.status(400).json({
        error: 'Invalid performance value'
      });
    }

    await predictionEngine.updateModelWeights(modelId, performance);

    res.json({
      success: true,
      message: 'Model weights updated successfully'
    });
  } catch (error) {
    logger.error('Error updating model weights', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router; 