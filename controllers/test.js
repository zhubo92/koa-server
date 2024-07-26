const {successResponse} = require("../utils/response");
const userService = require("../services/userService");
const {makeToken, verifyToken} = require("../utils/token");

const test = {
    async handleTest(ctx) {
        const {token} = ctx.request.header;
        const t = ctx.request.header.token;
        console.log(t, 't')
        // ctx.set("Token", 123);
        // const result = await userService.getUserInfoByPhone("15614410020");
        // const token = makeToken(result);
        // console.log(token, 'token')
        // const data = verifyToken(token);
        // console.log(data,'data');

        ctx.body = successResponse(token);
    },
};

module.exports = test;