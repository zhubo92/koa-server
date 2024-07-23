function log( ctx ) {
    console.log(ctx.method, ctx.header.host + ctx.url, ctx.request.body);
}

function loggerAsync() {
    return async function ( ctx, next ) {
        log(ctx);
        await next()
    }
}

module.exports = loggerAsync;