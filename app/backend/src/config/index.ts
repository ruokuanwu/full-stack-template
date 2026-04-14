export const config = {
    port: Number(process.env.PORT) || 3000,
    jwtSecret: process.env.JWT_SECRET || 'change-this-secret-in-production-min-32-chars',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    dbPath: process.env.DB_PATH || './data.db',
    nodeEnv: process.env.NODE_ENV || 'development',
    isDev: (process.env.NODE_ENV || 'development') === 'development',
    logLevel: (process.env.LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
    logDir: process.env.LOG_DIR || './logs',
} as const

export type Config = typeof config
