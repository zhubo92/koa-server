const homeDao = require("../dao/homeDao");
const {formatPageResponse} = require("../utils/response");
const {isPageEnum} = require("../utils/enums")

const homeService = {
    /**
     * 首页轮播图
     * @example homeService.getSlidesList()
     * @return {promise<object[]>} slides - 轮播图列表
     */
    async getSlidesList() {
        return await homeDao.querySlidesData();
    },
    /**
     * 首页导航
     * @example homeService.getNavList()
     * @return {promise<object[]>} nav - 导航列表
     */
    async getNavList() {
        return await homeDao.queryNavData();
    },
    /**
     * 首页商品
     * @example homeService.getGoodsList()
     * @return {promise<object[]>} goods - 商品列表
     */
    async getGoodsList() {
        return await homeDao.queryGoodsData();
    },
    /**
     * 搜索页商品分类
     * @example homeService.getGoodsCategoryList()
     * @return {promise<object[]>} category - 搜索页商品分类列表
     */
    async getGoodsCategoryList() {
        const category = await homeDao.queryCategoryData();
        const goods = await homeDao.queryGoodsCategoryData();

        return category.map(cate => {
            const items = goods.filter(good => good.name === cate.name);
            return {
                ...cate,
                items
            }
        });
    },
    /**
     * 推荐页商品
     * @example homeService.getRecommendList()
     * @return {promise<object[]>} recommend - 推荐页商品列表
     */
    async getRecommendList({page, pageSize, isPage}) {
        const data = await homeDao.queryRecommendData(page, pageSize);

        if (isPage === isPageEnum.PAGINATION) {
            const list = await homeDao.queryRecommendDataByPage(page, pageSize);

            return formatPageResponse(list, data.length, page, pageSize);
        }

        return data;
    },
    /**
     * 根据商品id和用户id获取在购物车中的记录
     * @example homeService.getShoppingCartByGoodsAndUserId(user_id, goods_id)
     * @param user_id - 用户id
     * @param goods_id - 商品id
     * @return {promise<object[]>} record - 在购物车中的记录
     */
    async getShoppingCartByGoodsAndUserId(user_id, goods_id) {
        const result = await homeDao.queryShoppingCartDataByGoodsAndUserId(user_id, goods_id);

        return result.length > 0 ? result[0]: null;
    },
    async getShoppingCartByUserId(user_id) {
        return await homeDao.queryShoppingCartDataByUserId(user_id);
    },
    /**
     * 更新商品数量
     * @example homeService.updateGoodsNumber(goods_id, number)
     * @param {string} user_id - 用户 id
     * @param {string} goods_id - 商品 id
     * @param {number} number - 商品数量
     */
    async updateGoodsNumber(user_id, goods_id, number) {
        await homeDao.updateGoodsNumberData(user_id, goods_id, number);
    },
    /**
     * 商品添加到购物车里
     * @example homeService.addGoodsInShoppingCart({user_id, goods_id, goods_name, thumb_url, price, number, is_pay})
     */
    async addGoodsInShoppingCart({user_id, goods_id, goods_name, thumb_url, price, number, is_pay}) {
        await homeDao.insertGoodsInShoppingCart({user_id, goods_id, goods_name, thumb_url, price, number, is_pay});
    },
    /**
     * 删除购物车数据
     * @example homeService.deleteShoppingCartByUserIdAndGoodsId(user_id, goods_id)
     */
    async deleteShoppingCartByUserIdAndGoodsId(user_id, goods_id) {
        await homeDao.deleteGoodsInShoppingCart(user_id, goods_id);
    }
}

module.exports = homeService;