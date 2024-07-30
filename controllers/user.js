const userService = require("../services/userService");
const {successResponse, UnknownError, ValidationError} = require("../utils/response");
const svgCaptcha = require('svg-captcha');
const {makeToken, verifyToken, decodeToken} = require("../utils/token");
const redis = require("../utils/redis");

const user = {
    /**
     * 获取图形验证码
     * @example /api/user/captcha
     * @return {string} {base64Img, captchaKey} - base64格式的图片和验证码对于的key
     */
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

        await redis.set(captchaKey, captcha.text.toLowerCase());

        console.log('captchaKey:', captchaKey, 'captchaValue:', captcha.text.toLowerCase());

        let img = new Buffer.from(captcha.data).toString("base64");

        let base64Img = "data:image/svg+xml;base64," + img;

        ctx.body = successResponse({base64Img, captchaKey});
    },
    /**
     * 获取手机登录验证码
     * @example /api/user/verificationCode?phone=15614410020
     * @param {string} phone - 手机号
     * @return {string} code - 代替真正的验证码
     */
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
    /**
     * 登录
     * @example /api/user/login
     * @param {string} phone - 手机号
     * @param {string} code - 短信验证码
     * @param {string} account - 账号
     * @param {string} password - 密码
     * @param {string} captcha - 图形验证码
     * @return {object} {userInfo, token} - 用户信息和 token
     */
    async login(ctx) {
        const {phone, code, account, password, captcha} = ctx.request.body;

        if(phone && code) {
            await this.loginByCode(ctx);
        } else if(account && password && captcha) {
            await this.loginByPassword(ctx);
        } else {
            ctx.body = new ValidationError("登录参数缺失");
        }
    },
    /**
     * 手机验证码登录
     * @example
     * /api/user/loginByCode
     * {
     *     "phone": "15614410020",
     *     "code": "ABCD"
     * }
     * @param {string} phone - 手机号
     * @param {string} code - 验证码
     * @return {object} {userInfo, token} - 用户信息和 token
     */
    async loginByCode(ctx) {
        const {phone, code} = ctx.request.body;

        if (!phone) {
            ctx.body = new UnknownError("请输入手机号");
            return;
        }

        const codeKey = `code:${phone}`;

        const codeInRedis = await redis.get(codeKey);

        if(!codeInRedis) {
            ctx.body = new UnknownError("验证码已过期，请重新获取验证码");
            return;
        }

        if (!code || codeInRedis !== code) {
            ctx.body = new UnknownError("验证码错误");
            return;
        }

        await redis.del(codeKey);

        let result = await userService.getUserInfoByPhone(phone);

        // 未注册用户，自动创建新用户
        if(!result) {
            await userService.registerUserByPhone(phone);
            result = await userService.getUserInfoByPhone(phone);
        }

        // 极端情况，未注册用户，创建新用户时失败了
        if (!result) {
            ctx.body = new UnknownError("未查到该用户之后，创建用户失败");
            return;
        }

        const token = makeToken(result);

        ctx.body = successResponse({userInfo: result, token}, "登录成功");
    },
    /**
     * 密码登录
     * @example
     * /api/user/loginByPassword
     * {
     *     "account": "zhubo",
     *     "password": "123456",
     *     "captcha": "iust"
     * }
     * header: {
     *     "captcha-key": "captcha:123213434324"
     * }
     * @param {string} account - 账号
     * @param {string} password - 密码
     * @param {string} captcha - 图形验证码
     * @param {string} "captcha-key" - 携带在请求头里面的图形验证码的 key
     * @return {object} {userInfo, token} - 用户信息和 token
     */
    async loginByPassword(ctx) {
        let {account, password, captcha} = ctx.request.body;

        if (captcha) captcha = captcha.toLowerCase();

        if (!account) {
            ctx.body = new UnknownError("请输入账号");
            return;
        }

        const captchaKey = ctx.request.header["captcha-key"];

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

        ctx.body = successResponse({userInfo: result, token}, "登录成功");
    },
    /**
     * 判断是否登录
     * @example
     * /api/user/isLogin
     * Header: {
     *     Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
     * }
     * @param {string} authorization - 请求头中的 authorization（token）
     * @return {boolean} state - 是否登录
     */
    async getIsLogin(ctx) {
        const token = ctx.get("authorization");

        if(!token || !verifyToken(token)) {
            ctx.body = successResponse(false);
            return;
        }

        ctx.body = successResponse(true);
    },
    async logout(ctx) {
        const token = ctx.get("authorization");

        if(verifyToken(token)) {
            const {userInfo, tokenInRedis} = decodeToken(token);
            const redisKey = `token:${userInfo.user_id}`;

            if(await redis.get(redisKey) === tokenInRedis) {
                await redis.del(redisKey);
            }
        }
        ctx.body = successResponse(null, "退出登录成功！");
    }
};

module.exports = user;