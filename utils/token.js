const jwt = require("jsonwebtoken");
const {ForbiddenError} = require("./response");

// 设置用于签署和验证 token 的密钥
const secretKey = process.env.SECRET_KEY;

// 生成 token
function makeToken(userInfo) {
    return jwt.sign({userInfo}, secretKey, {expiresIn: "24h"});
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

module.exports = {
    makeToken,
    verifyToken
};
