import { MarketData } from '../types/PredictionTypes';
import { Logger } from '../utils/Logger';

export class DataProcessor {
  private logger: Logger;
  private historicalData: MarketData[];
  private readonly windowSize: number;

  constructor(windowSize: number = 100) {
    this.logger = new Logger('DataProcessor');
    this.historicalData = [];
    this.windowSize = windowSize;
  }

  public processMarketData(data: MarketData): MarketData {
    try {
      // Add to historical data
      this.addToHistory(data);

      // Calculate technical indicators
      const indicators = this.calculateIndicators();

      // Calculate sentiment scores
      const sentiment = this.calculateSentiment();

      return {
        ...data,
        indicators,
        sentiment
      };
    } catch (error) {
      this.logger.error('Error processing market data', error);
      throw error;
    }
  }

  private addToHistory(data: MarketData): void {
    this.historicalData.push(data);
    if (this.historicalData.length > this.windowSize) {
      this.historicalData.shift();
    }
  }

  private calculateIndicators(): any {
    if (this.historicalData.length < 2) {
      return {
        rsi: 50,
        macd: 0,
        bollingerBands: {
          upper: 0,
          middle: 0,
          lower: 0
        }
      };
    }

    const prices = this.historicalData.map(d => d.price);
    
    return {
      rsi: this.calculateRSI(prices),
      macd: this.calculateMACD(prices),
      bollingerBands: this.calculateBollingerBands(prices)
    };
  }

  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) {
      return 50;
    }

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const difference = prices[prices.length - i] - prices[prices.length - i - 1];
      if (difference >= 0) {
        gains += difference;
      } else {
        losses -= difference;
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) {
      return 100;
    }
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateMACD(prices: number[]): number {
    const shortPeriod = 12;
    const longPeriod = 26;

    if (prices.length < longPeriod) {
      return 0;
    }

    const shortEMA = this.calculateEMA(prices, shortPeriod);
    const longEMA = this.calculateEMA(prices, longPeriod);

    return shortEMA - longEMA;
  }

  private calculateEMA(prices: number[], period: number): number {
    const multiplier = 2 / (period + 1);
    let ema = prices[0];

    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  private calculateBollingerBands(prices: number[], period: number = 20, stdDev: number = 2): any {
    if (prices.length < period) {
      const price = prices[prices.length - 1];
      return {
        upper: price * 1.02,
        middle: price,
        lower: price * 0.98
      };
    }

    const sma = this.calculateSMA(prices, period);
    const std = this.calculateStandardDeviation(prices, period, sma);

    return {
      upper: sma + (stdDev * std),
      middle: sma,
      lower: sma - (stdDev * std)
    };
  }

  private calculateSMA(prices: number[], period: number): number {
    const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  private calculateStandardDeviation(prices: number[], period: number, mean: number): number {
    const slice = prices.slice(-period);
    const squareDiffs = slice.map(price => Math.pow(price - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / period;
    return Math.sqrt(avgSquareDiff);
  }

  private calculateSentiment(): any {
    // Placeholder for sentiment analysis
    // In a real implementation, this would analyze social media, news, etc.
    return {
      social: Math.random(),
      news: Math.random()
    };
  }
} 