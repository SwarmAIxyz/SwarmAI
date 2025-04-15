import { PublicKey } from '@solana/web3.js';

export interface MarketData {
  id: string;
  creator: PublicKey;
  startTime: number;
  endTime: number;
  totalStake: number;
  resolved: boolean;
}

export interface PredictionData {
  value: number;
  stake: number;
  timestamp: number;
}

export interface IPredictionMarket {
  createMarket(duration: number): Promise<string>;
  submitPrediction(marketId: string, value: number, stake: number): Promise<string>;
  resolveMarket(marketId: string, actualValue: number): Promise<string>;
  claimReward(marketId: string): Promise<string>;
  getMarketState(marketId: string): Promise<MarketData>;
  getPrediction(marketId: string, predictor: PublicKey): Promise<PredictionData>;
  getMarkets(): Promise<MarketData[]>;
} 