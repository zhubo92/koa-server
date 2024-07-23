const Koa = require("koa");
const path = require("path");
const convert = require('koa-convert');
const bodyParser = require("koa-bodyparser");
const koaStatic = require("koa-static");
const cors = require('koa2-cors');
require('dotenv').config();

const loggerAsync  = require('./middleware/logger-async');
const router = require("./routes/index");

const PORT = process.env.SERVER_PORT;
const app = new Koa();



// 打印请求日志
app.use(loggerAsync());

// 解决跨域
app.use(cors());

// 静态资源加载
app.use(convert(koaStatic(
    path.join(__dirname, './static')
)));

// 解析中间件
app.use(bodyParser({
    enableTypes: ['json', 'form', 'text'],
    multipart: true,
}));

// 注册路由中间件，处理响应状态码
app.use(router.routes()).use(router.allowedMethods());


// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});