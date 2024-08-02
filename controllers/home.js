const homeService = require("../services/homeService");
const {successResponse} = require("../utils/response");
const {decodeToken} = require("../utils/token");
const {isPayEnum} = require("../utils/enums");

const home = {
    /**
     * 首页轮播图
     * @example /api/home/slides
     * @return {object[]} slides - 轮播图列表
     */
    async getSlides(ctx) {
        const result = await homeService.getSlidesList();
        ctx.body = successResponse(result);
    },
    /**
     * 首页导航
     * @example /api/home/nav
     * @return {object[]} nav - 导航列表
     */
    async getNav(ctx) {
        const result = await homeService.getNavList();
        ctx.body = successResponse(result);
    },
    /**
     * 首页商品
     * @example /api/home/goods
     * @return {object[]} goods - 商品列表
     */
    async getGoods(ctx) {
        const result = await homeService.getGoodsList();
        ctx.body = successResponse(result);
    },
    /**
     * 搜索页商品分类
     * @example /api/home/category
     * @return {object[]} category - 商品分类列表
     */
    async getCategory(ctx) {
        const result = await homeService.getGoodsCategoryList();
        ctx.body = successResponse(result);
    },
    /**
     * 推荐页商品
     * @example /api/home/recommend
     * @return {object[]} recommend - 推荐页商品列表
     */
    async getRecommend(ctx) {
        const {page = 1, pageSize = 10, isPage = 1} = ctx.request.query;
        const result = await homeService.getRecommendList({page, pageSize, isPage});
        ctx.body = successResponse(result);
    },
    /**
     * 商品添加到购物车
     * @example
     * /api/home/shoppingCart
     * {
     *     "goods_id": "123",
     *     "goods_name": "123",
     *     "thumb_url": "123",
     *     "price": "123",
     *     "number": "123",
     * }
     */
    async updateShoppingCart(ctx) {
        const token = ctx.get("authorization");
        const {userInfo: {user_id}} = decodeToken(token);
        const {goods_id, goods_name, thumb_url, price, number, is_pay = isPayEnum.UNPAID} = ctx.request.body;

        const result = await homeService.getShoppingCartByGoodsAndUserId(user_id, goods_id);

        if (result) { // 这个商品本来就在购物车里
            await homeService.updateGoodsNumber(user_id, goods_id, Number(number));
        } else { // 这个商品本来没有在购物车里
            await homeService.addGoodsInShoppingCart({user_id, goods_id, goods_name, thumb_url, price, number, is_pay});
        }

        ctx.body = successResponse(null, "添加成功！");
    },
    /**
     * 获取购物车商品数据
     * @example /api/home/shoppingCart
     * @return {object[]} goods[] - 商品列表
     */
    async getShoppingCart(ctx) {
        const token = ctx.get("authorization");
        const {userInfo: {user_id}} = decodeToken(token);

        const result = await homeService.getShoppingCartByUserId(user_id);

        ctx.body = successResponse(result);
    },
    /**
     * 删除购物车数据
     * @example
     * /api/home/shoppingCart
     * {
     *     "goods_id": "123"
     * }
     */
    async deleteShoppingCart(ctx) {
        const token = ctx.get("authorization");
        const {userInfo: {user_id}} = decodeToken(token);
        const {goods_id} = ctx.request.body;

        await homeService.deleteShoppingCartByUserIdAndGoodsId(user_id, goods_id);

        ctx.body = successResponse(null, "删除成功！");
    }
}

module.exports = home;