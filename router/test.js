const Router = require("koa-router");
const test = require("../controllers/test");

const router = new Router();

router.get("/index", test.handleGet);
router.post("/index", test.handlePost);
router.put("/index", test.handlePut);
router.del("/index", test.handleDelete);

module.exports = router;