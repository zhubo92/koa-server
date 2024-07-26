const Router = require("koa-router");
const user = require("../controllers/user");

const router = new Router();

/**
 * 获取图形验证码
 */
router.get("/captcha", user.getCaptcha);

/**
 * 发送手机登录验证码
 */
router.get("/VerificationCode", user.getVerificationCode);

/**
 * 手机验证码登录
 */
router.post("/loginByCode", user.loginByCode);

/**
 * 密码登录
 */
router.post("/loginByPassword", user.loginByPassword);


module.exports = router;