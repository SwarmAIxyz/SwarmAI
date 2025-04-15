export const AppConfig = {
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    timeout: 30000,
  },
  solana: {
    network: process.env.SOLANA_NETWORK || 'devnet',
    rpcEndpoint: process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com',
  },
  prediction: {
    minStake: 0.1,
    maxStake: 100,
    defaultTimeWindow: 3600, // 1 hour in seconds
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret',
    jwtExpiration: '24h',
  }
}; 