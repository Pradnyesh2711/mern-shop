const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const redis = require('redis');

const config = require('./utils/config');
const logger = require('./utils/logger');
const {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
} = require('./utils/middleware');
const productsRouter = require('./controllers/products');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const orderRouter = require('./controllers/orders');

logger.info('Connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch(error => {
    logger.error('Error connecting to MongoDB:', error.message);
  });

// Initialize Redis Client
const redisClient = redis.createClient({
    url: 'redis://default:JEw0y45ABaOuhHD9xURqT9Tzuo2bJtpi@redis-12310.c264.ap-south-1-1.ec2.redns.redis-cloud.com:12310'
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));

redisClient.connect().then(() => {
    logger.info('Connected to Redis');
}).catch((err) => {
    logger.error('Failed to connect to Redis:', err);
});

// Simple test to verify Redis connection
async function testRedis() {
    try {
        await redisClient.set('key', 'value', { EX: 300 });
        const value = await redisClient.get('key');
        logger.info(`Redis test value: ${value}`); // Outputs: 'value'
    } catch (err) {
        logger.error('Error with Redis operations:', err);
    }
}
testRedis();

const app = express();
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(tokenExtractor);

app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', orderRouter);

app.use('/api/*', unknownEndpoint);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
});

app.use(errorHandler);

module.exports = app;
