export interface PredictionResult {
  prediction: number;
  confidence: number;
  timestamp: Date;
  modelCount: number;
}

export interface Model {
  id: string;
  name: string;
  version: string;
  predict(data: MarketData): Promise<number>;
  performance: number;
  weight: number;
}

export interface MarketData {
  id: string;
  timestamp: number;
  price: number;
  volume: number;
  indicators?: {
    rsi: number;
    macd: number;
    bollingerBands: {
      upper: number;
      middle: number;
      lower: number;
    };
  };
  sentiment?: {
    social: number;
    news: number;
  };
}

export interface PredictionMetrics {
  accuracy: number;
  confidence: number;
  reward: number;
  stake: number;
}

export interface ModelPrediction {
  marketId: string;
  predictedValue: number;
  confidence: number;
  timestamp: number;
  metrics?: PredictionMetrics;
}

export interface MarketState {
  isActive: boolean;
  totalStake: number;
  participantCount: number;
  averageAccuracy: number;
  lastUpdateTimestamp: number;
} 