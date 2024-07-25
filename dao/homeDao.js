const {dbQuery} = require("../db");

const homeDao = {
    async querySlidesData() {
        return await dbQuery(`select * from slides;`);
    },
    async queryNavData() {
        return await dbQuery(`select * from nav;`);
    },
    async queryGoodsData() {
        return await dbQuery(`select * from goods;`);
    },
    async queryGoodsCategoryData() {
        return await dbQuery(`select * from search;`);
    },
    async queryCategoryData() {
        return await dbQuery(`select distinct name from search;`);
    },
    async queryRecommendDataByPage(page, pageSize) {
        return await dbQuery(`select * from recommend limit ${(page-1) * pageSize},${pageSize};`);
    },
    async queryRecommendData() {
        return await dbQuery(`select * from recommend;`);
    }
}

module.exports = homeDao;