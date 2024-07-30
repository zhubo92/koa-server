const Router = require("koa-router");
const test = require("../controllers/test");

const router = new Router();

router.get("/index", test.handleTest);

module.exports = router;