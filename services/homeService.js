const homeDao = require("../dao/homeDao");
const {formatPageResponse} = require("../utils/response");
const {isPageEnum} = require("../utils/enums")

const homeService = {
    async getSlidesList() {
        return await homeDao.querySlidesData();
    },
    async getNavList() {
        return await homeDao.queryNavData();
    },
    async getGoodsList() {
        return await homeDao.queryGoodsData();
    },
    async getGoodsCategoryList() {
        const category = await homeDao.queryCategoryData();
        const goods = await homeDao.queryGoodsCategoryData();

        const result = category.map(cate => {
            const items = goods.filter(good => good.name === cate.name);
            return {
                ...cate,
                items
            }
        })

        return result;
    },
    async getRecommendList({page, pageSize, isPage}) {
        const data = await homeDao.queryRecommendData(page, pageSize);

        if(isPage === isPageEnum.PAGINATION) {
            const list = await homeDao.queryRecommendDataByPage(page, pageSize);

            return formatPageResponse(list, data.length, page, pageSize);
        }

        return data;
    }
}

module.exports = homeService;