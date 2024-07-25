const jwt = require("jsonwebtoken");
const koaJwt = require("koa-jwt");

// 设置用于签署和验证 token 的密钥
const secretKey = process.env.SECRET_KEY;

// 创建一个中间件来校验 token
const tokenMiddleware = koaJwt({ secret: secretKey }).unless({
    // 登录和注册接口除外
    path: [/^\/userModel/],
});

module.exports = tokenMiddleware;