const webpackMiddleware = require("webpack-hot-middleware");

module.exports = function(compiler, options) {
    const instance = webpackMiddleware(compiler, options);

    function webpackKoaMiddleware(ctx, next) {
        instance(ctx.req,ctx.res,next);
    }

    webpackKoaMiddleware.publish = instance.publish;
    return webpackKoaMiddleware;
};