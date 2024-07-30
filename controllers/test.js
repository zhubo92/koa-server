const {successResponse} = require("../utils/response");
const userService = require("../services/userService");
const {makeToken, decodeToken} = require("../utils/token");

const test = {
    async handleTest(ctx) {
        // const token = ctx.get("authorization");
        // const decoded = decodeToken(token);
        // const captchaKey = ctx.request.header["captcha-key"];
        // const {token} = ctx.request.header;
        // const t = ctx.request.header.token;
        // console.log(captchaKey, 'captchaKey')
        // ctx.set("Token", 123);
        // const result = await userService.getUserInfoByPhone("15614410020");
        // const token = makeToken(result);
        // console.log(token, 'token')
        // const data = verifyToken(token);
        // console.log(data,'data');

        ctx.body = successResponse();
    },
};

module.exports = test;