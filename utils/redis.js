const Redis = require('ioredis');

const {REDIS_HOST, REDIS_PORT} = process.env;

// 创建 Redis 客户端实例, 连接指定的 Redis 服务器
const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT
});

// 获取
async function getRedis(key) {
    return await redis.get(key);
}

// 设置
async function setRedis(key, value) {
    await redis.set(key, value);
}

// 删除
async function delRedis(key) {
    await redis.del(key);
}

module.exports = {
    getRedis,
    setRedis,
    delRedis
};