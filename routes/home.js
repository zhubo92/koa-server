const Router = require("koa-router");
const home = require("../controllers/home");

const router = new Router();

router.get("/carousel", home.carouselPage);

module.exports = router;