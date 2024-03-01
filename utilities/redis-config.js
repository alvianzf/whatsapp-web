const Redis = require('ioredis');
require('dotenv').config()

const redisClient = new Redis({
   host: process.env.REDIS_HOST,
   port: process.env.REDIS_PORT,
   username: process.env.REDIS_USERNAME,
   db: process.env.REDIS_NAMES_INDEX
});

const redisImage = new Redis({
   host: process.env.REDIS_HOST,
   port: process.env.REDIS_PORT,
   username: process.env.REDIS_USERNAME,
   db: process.env.REDIS_IMAGES_INDEX
})

module.exports = {redisClient, redisImage};
