const Router = require("koa-router");
const home = require("../controllers/home");

const router = new Router();

// 首页轮播图
router.get("/slides", home.getSlides);

// 首页导航
router.get("/nav", home.getNav);

// 首页商品
router.get("/product", home.getGoods);

// 搜索页商品分类
router.get("/category", home.getCategory);

// 推荐页商品
router.get("/recommend", home.getRecommend);

// 获取购物车商品数据
router.get("/cart", home.getShoppingCart);

// 商品添加到购物车或更改商品数量
router.post("/cart", home.updateShoppingCart);

// 删除购物车数据
router.del("/cart", home.deleteShoppingCart);


module.exports = router;