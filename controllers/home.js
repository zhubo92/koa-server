const homeService = require("../services/homeService");
const {successResponse} = require("../utils/response");

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
    }
}

module.exports = home;