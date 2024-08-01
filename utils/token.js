const jwt = require("jsonwebtoken");
const redis = require("../utils/redis");

/**
 * 说明：本系统的 token 由 jwt 和 redis 搭配验证，
 */


// 设置用于签署和验证 token 的密钥
const secretKey = process.env.SECRET_KEY;

// 表示 Token 有效期  不带单位默认为秒  如带单位如: "2 days", "10h", "7d"
const expiresIn = process.env.TOKEN_EXPIRES_IN;

/**
 * 生成 token
 * @example // createToken(userInfo)
 * @param {object} userInfo - 用户信息
 * @return {string} name - description
 */
function createToken(userInfo) {
    // 储存在 redis 中
    async function saveInRedis() {
        const redisKey = `token:${userInfo.user_id}`;

        let queueInRedis = await redis.get(redisKey);

        if(!queueInRedis) {
            queueInRedis = "";
        }

        const newQueueInRedis = [tokenCreateTime, ...queueInRedis.split(",")];

        await redis.set(redisKey, newQueueInRedis.slice(0, 5).toString());
    }

    saveInRedis();

    const tokenCreateTime = Date.now();

    return jwt.sign({userInfo, tokenCreateTime}, secretKey, {expiresIn});

}

// 验证 token
function verifyToken(token) {
    try {
        const jwtState = jwt.verify(token, secretKey);

        if(!jwtState) return false;

        const {userInfo, tokenCreateTime} = decodeToken(token);

        const redisKey = `token:${userInfo.user_id}`;

        const currentTokenInRedis = redis.get(redisKey);

        return currentTokenInRedis === tokenCreateTime;
    } catch (e) {
        console.log(e, 'verifyToken.error');
        return false;
    }
}

// 解析 token
function decodeToken(token) {
    return jwt.decode(token);
}

module.exports = {
    createToken,
    verifyToken,
    decodeToken
};
