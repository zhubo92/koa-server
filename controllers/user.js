const userService = require("../services/userService");
const {successResponse, UnknownError, ForbiddenError} = require("../utils/response");
const svgCaptcha = require('svg-captcha');
const jwt = require("jsonwebtoken");
const Redis = require('ioredis');
const {makeToken} = require("../utils/token");

// 创建 Redis 客户端实例, 连接指定的 Redis 服务器
const redis = new Redis({
    port: 6379,
    host: '127.0.0.1'
});

// 密钥
const secretKey = process.env.SECRET_KEY;

const user = {
    async getCaptcha(ctx) {
        const captcha = svgCaptcha.create({
            size: 4, // 验证码长度
            width: 120, //验证码的宽度
            height: 40, //验证码的高度
            fontSize: 45, //验证码的字体大小
            ignoreChars: "0oO1ilI", // 验证码字符中排除 0o1i
            noise: 2, // 干扰线条的数量
            color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
            background: "#eee", // 验证码图片背景颜色
        });

        const captchaKey = `captcha:${Date.now()}`;

        ctx.set("Captcha-Key", captchaKey);

        await redis.set(captchaKey, captcha.text.toLowerCase());

        console.log(captcha.text, 'captcha.text');

        let img = new Buffer.from(captcha.data).toString("base64");

        let base64Img = "data:image/svg+xml;base64," + img;

        ctx.body = successResponse(base64Img);
    },
    async getVerificationCode(ctx) {
        const {phone} = ctx.request.query;

        if (!phone) {
            ctx.body = new UnknownError("请输入手机号");
            return;
        }

        const code = Math.random().toFixed(6).slice(-6);

        const codeKey = `code:${phone}`;

        await redis.set(codeKey, code);

        ctx.body = successResponse(code, "发送成功");
    },
    async loginByCode(ctx) {
        const {phone, code} = ctx.request.body;

        if (!phone) {
            ctx.body = new UnknownError("请输入手机号");
            return;
        }

        const codeKey = `code:${phone}`;

        const codeInRedis = await redis.get(codeKey);

        if (!code || codeInRedis !== code) {
            ctx.body = new UnknownError("验证码错误");
            return;
        }

        await redis.del(codeKey);

        const result = await userService.getUserInfoByPhone(phone);

        if (!result) {
            ctx.body = new UnknownError("未查到该用户之后，创建用户失败");
            return;
        }

        const token = makeToken(result);

        ctx.set("Token", token);

        ctx.body = successResponse(result, "登录成功");
    },
    async loginByPassword(ctx) {
        let {account, password, captcha} = ctx.request.body;

        if (captcha) captcha = captcha.toLowerCase();

        if (!account) {
            ctx.body = new UnknownError("请输入账号");
            return;
        }

        const captchaKey = ctx.headers["captcha-key"];

        const captchaInRedis = await redis.get(captchaKey);

        if (!captcha || captcha !== captchaInRedis) {
            ctx.body = new UnknownError("验证码错误");
            return;
        }

        await redis.del(captchaKey);

        const result = await userService.getUserInfoByAccountAndPassword(account, password);

        if (!result) {
            ctx.body = new UnknownError("用户名或者密码错误");
            return;
        }

        const token = makeToken(result);

        ctx.set("Token", token);

        ctx.body = successResponse(result, "登录成功");
    }
};

module.exports = user;