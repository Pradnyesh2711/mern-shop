const redis = require('redis');

const client = redis.createClient({
    url: 'redis://default:JEw0y45ABaOuhHD9xURqT9Tzuo2bJtpi@redis-12310.c264.ap-south-1-1.ec2.redns.redis-cloud.com:12310'
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.error('Failed to connect to Redis:', err);
});

module.exports = client;
