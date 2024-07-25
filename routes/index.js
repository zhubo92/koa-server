const Router = require("koa-router");
const home = require("./home");
const user = require("./user");

const router = new Router({
    // 设置所有路由的前缀
    prefix: '/api'
});

router.use("/home", home.routes(), home.allowedMethods());
router.use("/user", user.routes(), user.allowedMethods());

module.exports = router;