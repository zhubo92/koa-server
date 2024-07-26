const {verifyToken} = require("../utils/token");
const {ForbiddenError} = require("../utils/response");

// 设置用于签署和验证 token 的密钥
const secretKey = process.env.SECRET_KEY;

// 创建一个中间件来校验 token
async function tokenMiddleware(ctx, next) {
    const token = ctx.get("token");
    const {url} = ctx.request;

    if (!url.startsWith("/api/user")) {
        if(!token) {
            ctx.body = new ForbiddenError("token 已过期，请重新登录");
            return;
        }

        const result = verifyToken(token);

        if(!result) {
            ctx.body = new ForbiddenError("token 已过期，请重新登录");
            return;
        }
    }

    await next();
}

module.exports = tokenMiddleware;