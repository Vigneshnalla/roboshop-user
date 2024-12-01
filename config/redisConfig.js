const redis = require('redis');
const logger = require('pino')();

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'redis',
});

redisClient.on('error', (error) => logger.error('Redis ERROR', error));
redisClient.on('ready', () => logger.info('Redis READY'));

module.exports = redisClient;
