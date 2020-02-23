const Redis = require('ioredis')

const redis = new Redis(
  process.env.REDIS_PORT || 6379,
  process.env.REDIS_HOST
)

module.exports = redis