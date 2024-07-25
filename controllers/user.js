const userService = require("../services/userService");
const {successResponse, UnknownError} = require("../utils/response");
const svgCaptcha = require('svg-captcha');
const jwt = require("jsonwebtoken");

// 存储用户手机验证码
const verifyCode = {};

const secretKey = process.env.SECRET_KEY;

const user = {
    getCaptcha(ctx) {
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

        ctx.session.captcha = captcha.text.toLowerCase();
        console.log(captcha.text, 'captcha.text');

        let img = new Buffer.from(captcha.data).toString("base64");
        let base64Img = "data:image/svg+xml;base64," + img;
        ctx.body = successResponse(base64Img);
    },
    async getVerifyCode(ctx) {
        const { phone } = ctx.request.query;
        if(!phone) {
            ctx.body = new UnknownError("请输入手机号").toResponseJSON();
            return;
        }
        const code = Math.random().toFixed(6).slice(-6);
        verifyCode[phone] = code;
        ctx.body = successResponse(code, "发送成功");
    },
    async loginByCode(ctx) {
        const { phone, code } = ctx.request.body;

        if(!phone) {
            ctx.body = new UnknownError("请输入手机号").toResponseJSON();
            return;
        }
        if(!code || verifyCode[phone] !== code) {
            ctx.body = new UnknownError("验证码错误").toResponseJSON();
            return;
        }

        delete verifyCode[phone];

        const result = await userService.getUserInfoByPhone(phone);

        if(!result) {
            ctx.body = new UnknownError("未查到该用户之后，创建用户失败").toResponseJSON();
            return;
        }

        ctx.body = successResponse(result, "登录成功");
    },
    async loginByPassword(ctx) {
        let { account, password, captcha } = ctx.request.body;
        if(captcha) captcha = captcha.toLowerCase();

        if(!account) {
            ctx.body = new UnknownError("请输入账号").toResponseJSON();
            return;
        }
        console.log(ctx.session, captcha, 'captcha')
        if(!captcha || captcha !== ctx.session.captcha) {
            ctx.body = new UnknownError("验证码错误").toResponseJSON();
            return;
        }

        delete ctx.session.captcha;

        const result = await userService.getUserInfoByAccountAndPassword(account, password);

        if(!result) {
            ctx.body = new UnknownError("用户名或者密码错误").toResponseJSON();
            return;
        }

        // 生成token
        const token = jwt.sign({ userInfo: result }, secretKey, { expiresIn: "24h" });

        ctx.body = successResponse({userInfo: result, token}, "登录成功");
    }
};

module.exports = user;