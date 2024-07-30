const Router = require("koa-router");
const home = require("../controllers/home");

const router = new Router();

// 首页轮播图
router.get("/slides", home.getSlides);

// 首页导航
router.get("/nav", home.getNav);

// 首页商品
router.get("/goods", home.getGoods);

// 搜索页商品分类
router.get("/category", home.getCategory);

// 推荐页商品
router.get("/recommend", home.getRecommend);


module.exports = router;