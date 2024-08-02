const jwt = require("jsonwebtoken");
const {getRedis, setRedis} = require("./redis");

/**
 * 说明：
 * 本系统的 token 由 jwt 和 redis 搭配验证。
 * token 有效的同时，redis存储的队列中也得有这个 token 生成时的时间戳，这样才是真正的未过期 token。
 * 这样做的目的是为了主动过期某些 token，也是为了便于退出登录。
 */


// 设置用于签署和验证 token 的密钥
const secretKey = process.env.SECRET_KEY;

// 表示 Token 有效期  不带单位默认为秒  如带单位如: "2 days", "10h", "7d"
const expiresIn = process.env.TOKEN_EXPIRES_IN;

// token 最多登录几台设备
const maxNumber = process.env.TOKEN_MAX_NUMBER;

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

        let queueInRedis = await getRedis(redisKey);

        if(!queueInRedis) {
            queueInRedis = "";
        }

        const newQueueInRedis = [tokenCreateTime, ...queueInRedis.split(",")];

        await setRedis(redisKey, newQueueInRedis.slice(0, maxNumber).toString());
    }

    saveInRedis();

    const tokenCreateTime = Date.now();

    return jwt.sign({userInfo, tokenCreateTime}, secretKey, {expiresIn});

}

// 验证 token
async function verifyToken(token) {
    try {

        jwt.verify(token, secretKey);

        const {userInfo, tokenCreateTime} = decodeToken(token);

        const redisKey = `token:${userInfo.user_id}`;

        const currentTokenInRedis = await getRedis(redisKey);

        console.log(currentTokenInRedis, 'currentTokenInRedis', tokenCreateTime)

        return !!currentTokenInRedis.split(",").find(item => item === tokenCreateTime.toString());

    } catch (e) { // 一般都是 token 过期了

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
