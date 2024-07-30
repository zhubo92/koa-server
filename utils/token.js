const jwt = require("jsonwebtoken");
const redis = require("../utils/redis");

// 设置用于签署和验证 token 的密钥
const secretKey = process.env.SECRET_KEY;

// 表示 Token 有效期  不带单位默认为秒  如带单位如: "2 days", "10h", "7d"
const expiresIn = process.env.TOKEN_EXPIRES_IN;

// 生成 token
function makeToken(userInfo) {
    const tokenInRedis = Date.now();

    const redisKey = `token:${userInfo.user_id}`;

    redis.set(redisKey, tokenInRedis);
    console.log(expiresIn,'expiresIn')
    return jwt.sign({userInfo, tokenInRedis}, secretKey, {expiresIn});
}

// 验证 token
function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (e) {
        console.log(e, 'verifyToken.error');
        return null;
    }
}

// 解析 token
function decodeToken(token) {
    return jwt.decode(token);
}

module.exports = {
    makeToken,
    verifyToken,
    decodeToken
};
