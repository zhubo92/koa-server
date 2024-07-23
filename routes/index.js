const Router = require("koa-router");
const home = require("./home");

const router = new Router({
    // 设置所有路由的前缀
    prefix: '/api'
});

router.use("/home", home.routes(), home.allowedMethods());

module.exports = router;