const Router = require("koa-router");
const user = require("../controllers/user");

const router = new Router();

// 获取图形验证码
router.get("/captcha", user.getCaptcha);

// 获取手机登录验证码
router.get("/verificationCode", user.getVerificationCode);

// 账号密码图形验证码登录
router.post("/loginByPassword", user.loginByPassword);

// 手机号短信验证码登录
router.post("/loginByCode", user.loginByCode);

// 登录
router.post("/login", user.login);

// 判断是否登录
router.get("/isLogin", user.getIsLogin);

// 退出登录
router.post("/logout", user.logout);

// 更新用户信息
router.put("/info", user.updateUserInfo);

// 修改密码
router.put("/password", user.updateUserPassword);


module.exports = router;