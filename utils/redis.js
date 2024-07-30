const Redis = require('ioredis');

const {REDIS_HOST, REDIS_PORT} = process.env;

// 创建 Redis 客户端实例, 连接指定的 Redis 服务器
const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT
});

module.exports = redis;