const {dbQuery} = require("../utils/db");

const userDao = {
    async queryUserInfoDataByPhone(phone) {
        return await dbQuery(`select * from user where user_phone='${phone}';`);
    },
    async queryUserInfoDataById(user_id) {
        return await dbQuery(`select * from user where user_id='${user_id}';`);
    },
    async queryUserInfoDataByAccount(account) {
        return await dbQuery(`select * from user where user_name='${account}' or user_phone= '${account}';`);
    },
    async insertUserData(phone) {
        return await dbQuery(`insert into user(user_name,user_phone) values('用户-${phone}','${phone}');`);
    },
    async updateUserInfoData({user_id, user_name, user_sex, user_address, user_birthday, user_signature}) {
        await dbQuery(
            `update user set user_name='${user_name}',user_sex='${user_sex}',user_address='${user_address}',user_birthday='${user_birthday}',user_signature='${user_signature}' where user_id=${user_id};`
        );
    },
    async queryUserInfoByUserId(user_id) {
        return await dbQuery(`select * from user where user_id='${user_id}';`);
    },
    async updatePasswordData({user_id, new_password}) {
        return await dbQuery(`update user set user_pwd='${new_password}' where user_id=${user_id};`);
    }
};

module.exports = userDao;