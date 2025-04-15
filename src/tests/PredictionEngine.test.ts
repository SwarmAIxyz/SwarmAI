import { PredictionEngine } from '../core/PredictionEngine';
import { MarketData } from '../types/PredictionTypes';
import { TensorflowModel } from '../models/TensorflowModel';

describe('PredictionEngine', () => {
  let predictionEngine: PredictionEngine;

  beforeEach(() => {
    predictionEngine = new PredictionEngine();
  });

  it('should generate predictions', async () => {
    // Create test market data
    const marketData: MarketData = {
      price: 100,
      volume: 1000000,
      timestamp: new Date(),
      indicators: {
        rsi: 55,
        macd: 0.5,
        bollingerBands: {
          upper: 105,
          middle: 100,
          lower: 95
        }
      },
      sentiment: {
        social: 0.7,
        news: 0.6
      }
    };

    // Add a test model
    const model = new TensorflowModel('test-model', 'Test Model', '1.0.0');
    await predictionEngine.getModelRegistry().registerModel(model);

    // Generate predictions
    const result = await predictionEngine.generatePredictions(marketData);

    // Verify prediction structure
    expect(result).toBeDefined();
    expect(result.prediction).toBeDefined();
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.modelCount).toBe(1);
  });

  it('should update model weights', async () => {
    // Add a test model
    const model = new TensorflowModel('test-model', 'Test Model', '1.0.0');
    await predictionEngine.getModelRegistry().registerModel(model);

    // Update model weights
    await predictionEngine.updateModelWeights('test-model', 0.8);

    // Verify weight update
    const models = await predictionEngine.getModelRegistry().getActiveModels();
    const updatedModel = models.find(m => m.id === 'test-model');

    expect(updatedModel).toBeDefined();
    expect(updatedModel?.performance).toBe(0.8);
    expect(updatedModel?.weight).toBeGreaterThan(0);
  });

  it('should handle invalid market data', async () => {
    const invalidMarketData = {
      price: -1, // Invalid price
      volume: 0  // Invalid volume
    };

    await expect(
      predictionEngine.generatePredictions(invalidMarketData as MarketData)
    ).rejects.toThrow();
  });
}); 