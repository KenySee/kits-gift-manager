const webpackMiddleware = require("webpack-hot-server-middleware");

module.exports = function(compiler, options) {
    const instance = webpackMiddleware(compiler, options);

    function webpackKoaMiddleware(ctx, next) {
        instance(ctx.req,ctx,next);
    }

    return webpackKoaMiddleware;
};