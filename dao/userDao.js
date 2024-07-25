const {dbQuery} = require("../db");

const userDao = {
    async queryUserInfoDataByPhone(phone) {
        return await dbQuery(`select * from user where user_phone='${phone}';`);
    },
    async insertUserData(phone) {
        return await dbQuery(`insert into user(user_name,user_phone) values('用户-${phone}','${phone}');`);
    },
    async queryUserInfoDataByAccount(account) {
        return await dbQuery(`select * from user where user_name='${account}' or user_phone= '${account}';`);
    }
};

module.exports = userDao;