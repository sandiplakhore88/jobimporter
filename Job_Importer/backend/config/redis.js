
const Redis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL
let redis;

const initRedis =() =>{
  redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null, 
  });

  redis.on('connect', () => console.log('Redis connected'));
  redis.on('error', (error) => console.error('Redis error:', error));
}

const getRedis =()=> {
  return redis;
}

module.exports = { initRedis, getRedis };
