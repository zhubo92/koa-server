const {dbQuery} = require("../utils/db");

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
    },
    async queryShoppingCartDataByGoodsAndUserId(user_id, goods_id) {
        return await dbQuery(`select * from shopping_cart where user_id=${user_id} and goods_id=${goods_id};`);
    },
    async queryShoppingCartDataByUserId(user_id) {
        return await dbQuery(`select * from shopping_cart where user_id=${user_id};`);
    },
    async updateGoodsNumberData(user_id, goods_id, number) {
        await dbQuery(`update shopping_cart set number=${number} where user_id=${user_id} and goods_id=${goods_id};`);
    },
    async insertGoodsInShoppingCart({user_id, goods_id, goods_name, thumb_url, price, number, is_pay}) {
        await dbQuery(`insert into shopping_cart values(${user_id}, ${goods_id}, '${goods_name}', '${thumb_url}', ${price}, ${number}, ${is_pay});`);
    },
    async deleteGoodsInShoppingCart(user_id, goods_id) {
        await dbQuery(`delete from shopping_cart where user_id=${user_id} and goods_id=${goods_id};`);
    }
}

module.exports = homeDao;