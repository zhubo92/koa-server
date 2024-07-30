const {verifyToken} = require("../utils/token");
const {ForbiddenError} = require("../utils/response");

// 设置用于签署和验证 token 的密钥
const secretKey = process.env.SECRET_KEY;

// 创建一个中间件来校验 token
async function tokenMiddleware(ctx, next) {
    console.log(ctx.response.status,'ctx.response.status')
    if(ctx.response.status === 200) {
        const token = ctx.get("authorization");
        const {url} = ctx.request;

        if (!url.startsWith("/api/user") && (!token || !verifyToken(token))) {
            ctx.body = new ForbiddenError("token 已过期，请重新登录");
            return;
        }
    }

    await next();
}

module.exports = tokenMiddleware;