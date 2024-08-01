const {successResponse} = require("../utils/response");
const userService = require("../services/userService");
const {createToken, decodeToken} = require("../utils/token");
const redis = require("../utils/redis");

const test = {
    async handleGet(ctx) {
        const result = await userService.getUserInfoByPhone("15614410020");
        const token = createToken(result);
        // const token = ctx.get("authorization");
        // const decoded = decodeToken(token);
        // const captchaKey = ctx.request.header["captcha-key"];
        // const {token} = ctx.request.header;
        // const t = ctx.request.header.token;
        // console.log(captchaKey, 'captchaKey')
        // ctx.set("Token", 123);
        // console.log(token, 'token')
        // const data = verifyToken(token);
        // console.log(data,'data');

        ctx.body = successResponse(token);
    },
    async handlePost(ctx) {
        const result = await userService.getUserInfoByPhone("15614410020");

        const redisKey = `token:${result.user_id}`;

        const redisValue = await redis.get(redisKey);

        // 1722408975245,1722408928737,1722408819148,1722408800431,1722325436178

        ctx.body = successResponse(redisValue);
    },
    async handlePut(ctx) {
        const result = await userService.getUserInfoByPhone("15614410020");
        const token = createToken(result);

        ctx.body = successResponse(token);
    },
    async handleDelete(ctx) {
        const result = await userService.getUserInfoByPhone("15614410020");
        const token = createToken(result);

        ctx.body = successResponse(token);
    },
};

module.exports = test;