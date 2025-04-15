import dotenv from 'dotenv';

dotenv.config();

export const config = {
  app: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development'
  },
  database: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/swarmai'
  },
  solana: {
    network: process.env.SOLANA_NETWORK || 'devnet',
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com'
  },
  ai: {
    modelSavePath: process.env.MODEL_SAVE_PATH || './models',
    trainingEpochs: parseInt(process.env.TRAINING_EPOCHS || '100', 10),
    batchSize: parseInt(process.env.BATCH_SIZE || '32', 10),
    learningRate: parseFloat(process.env.LEARNING_RATE || '0.001')
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'app.log'
  }
}; 