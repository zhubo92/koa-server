const homeService = require("../services/homeService");
const {successResponse} = require("../utils/response");

const home = {
    async getSlides(ctx) {
        const result = await homeService.getSlidesList();
        ctx.body = successResponse(result);
    },
    async getNav(ctx) {
        const result = await homeService.getNavList();
        ctx.body = successResponse(result);
    },
    async getGoods(ctx) {
        const result = await homeService.getGoodsList();
        ctx.body = successResponse(result);
    },
    async getCategory(ctx) {
        const result = await homeService.getGoodsCategoryList();
        ctx.body = successResponse(result);
    },
    async getRecommend(ctx) {
        const {page = 1, pageSize = 10, isPage = 1} = ctx.request.query;
        const result = await homeService.getRecommendList({page, pageSize, isPage});
        ctx.body = successResponse(result);
    }
}

module.exports = home;