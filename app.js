const Koa = require("koa");
const path = require("path");
const convert = require('koa-convert');
const bodyParser = require("koa-bodyparser");
const koaStatic = require("koa-static");
const cors = require('koa2-cors');
const KoaLogger = require("koa-logger");
const log4js = require('log4js');
require('dotenv').config();

const router = require("./routes/index");
const {UnknownError, ForbiddenError} = require("./utils/response");
const { isProd } = require('./utils/index');
const { log, errLogger, resLogger } = require('./utils/log4js');
const tokenMiddleware = require("./middleware/tokenMiddleware");

const PORT = process.env.SERVER_PORT;
const app = new Koa();

// 控制台打印请求日志
app.use(KoaLogger());

// 接口访问日志文件
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const end = new Date() - start;
    // 生产环境下，使用中间件记录日志，使用console.log打印消息。
    // 其他环境下，使用log4js的console打印信息。
    if (isProd) {
        resLogger(ctx, end);
        console.log((`${ctx.method} ${ctx.url} - ${end}ms`));
    } else {
        log.info(`${ctx.method} ${ctx.url} - ${end}ms`);
    }
});

// 错误日志文件
app.on('error', (err, ctx) => {
    if (isProd) {
        errLogger(ctx, err);
        log.error(`${ctx.method} ${ctx.url}`, err);
    } else {
        console.error(`${ctx.method} ${ctx.url}`, err);
    }
});

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

// 401
app.use((ctx, next) => {
    return next().catch((err) => {
        if (err.status == 401) {
            ctx.body = new ForbiddenError().toResponseJSON();
        } else {
            throw err;
        }
    });
});

// 应用 token 校验中间件
app.use(tokenMiddleware);

// 注册路由中间件，处理响应状态码
app.use(router.routes()).use(router.allowedMethods());

// 全局监听异常信息
app.on('error', err => {
    console.error('server error', err)
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});