const userDao = require("../dao/userDao");

const userService = {
    /**
     * 注册新用户
     * @example userService.registerUserByPhone(phone)
     * @param {string} phone - 手机号
     */
    async registerUserByPhone(phone) {
        await userDao.insertUserData(phone);
    },
    /**
     * 通过手机号获取用户信息
     * @example userService.getUserInfoByPhone(phone)
     * @param {string} phone - 手机号
     * @return {object|null} userInfo - 用户信息
     */
    async getUserInfoByPhone(phone) {
        const result = await userDao.queryUserInfoDataByPhone(phone);

        return result.length > 0 ? result[0] : null;
    },
    /**
     * 通过用户id获取用户信息
     * @example userService.getUserInfoById(id)
     * @param {string} id - 用户id
     * @return {object|null} userInfo - 用户信息
     */
    async getUserInfoById(id) {
        const result = await userDao.queryUserInfoDataById(id);

        return result.length > 0 ? result[0] : null;
    },
    /**
     * 通过账号密码获取用户信息
     * @example userService.getUserInfoByAccountAndPassword(account, password)
     * @param {string} account - 账号
     * @param {string} password - 密码
     * @return {object|null} userInfo - 用户信息
     */
    async getUserInfoByAccountAndPassword(account, password) {
        const result = await userDao.queryUserInfoDataByAccount(account);

        if (result.length === 0 || result[0].user_pwd !== password) {
            return null;
        }

        return result[0];
    },
    /**
     * 更新用户信息
     * @example userService.updateUserInfo(newUserInfo)
     * @param {object} newUserInfo - 新用户信息
     * @return {object} newUserInfo - 新用户信息
     */
    async updateUserInfo(newUserInfo) {
        await userDao.updateUserInfoData(newUserInfo);

        return newUserInfo;
    },
    /**
     * 修改密码
     * @example userService.updatePassword({user_id, new_password})
     * @param {object} user_id new_password - 用户id 和 新密码
     */
    async updatePassword({user_id, new_password}) {
        await userDao.updatePasswordData({user_id, new_password});
    }
};

module.exports = userService;