const Router = require("koa-router");
const db = require("../db");
const {successResponse, UnknownError} = require("../utils/response");

const user = new Router();

user.post('/login', async (ctx, next) => {
    const {userName, password} = ctx.request.body;
    const result = await db.query(`select * from user where user_name = ? and user_password = ?`, [userName, password]);
    if (result.length > 0) {
        ctx.body = successResponse(result[0], "登录成功");
    } else {
        ctx.body = new UnknownError("登录失败").toResponseJSON();
    }
});

user.get("/user", async ctx => {
    const result = await db.query(`SELECT * FROM user`);
    ctx.body = successResponse(result);
});

user.post("/user", async ctx => {
    const { name, password } = ctx.request.body;
    await db.query("INSERT INTO user (user_name, user_password) VALUES (?, ?)", [
        name,
        password,
    ]);
    ctx.body = successResponse(null, "修改成功");
});

module.exports = user;