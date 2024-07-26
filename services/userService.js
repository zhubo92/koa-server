const userDao = require("../dao/userDao");

const userService = {
    async registerUserByPhone(phone) {
        await userDao.insertUserData(phone);
    },
    async getUserInfoByPhone(phone) {
        const result = await userDao.queryUserInfoDataByPhone(phone);

        if (result.length > 0) {
            return result[0];
        }

        await this.registerUserByPhone(phone);

        const newResult = await userDao.queryUserInfoDataByPhone(phone);

        if (newResult.length > 0) {
            return newResult[0];
        }

        return null;
    },
    async getUserInfoByAccountAndPassword(account, password) {
        const result = await userDao.queryUserInfoDataByAccount(account);

        if (result.length === 0 || result[0].user_pwd !== password) {
            return null;
        }

        return result[0];
    }
};

module.exports = userService;