const {successResponse} = require("../utils/response");
const userService = require("../services/userService");
const {createToken, verifyToken} = require("../utils/token");
const {queryUserInfoByUserId, updateUserInfoData} = require("../dao/userDao");

const test = {
    async handleGet(ctx) {
        const result = await queryUserInfoByUserId("666");

        ctx.body = successResponse(result);
    },
    async handlePost(ctx) {
        const result = await updateUserInfoData({
            "user_id": 666,
            "user_name": "zhubo1",
            "user_sex": "男",
            "user_birthday": "1999/05/12",
            "user_address": "山东1",
            "user_signature": "我也爱学习1"
        });

        ctx.body = successResponse(result);
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