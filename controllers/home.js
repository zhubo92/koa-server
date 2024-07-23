const homeService = require("../services/homeService");
const {successResponse} = require("../utils/response");
const home = {
    async carouselPage(ctx) {
        // const result = await homeService.getCarouselList();
        ctx.body = successResponse([], "查询成功");
    }
}

module.exports = home;