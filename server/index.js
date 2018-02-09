import 'babel-polyfill'
import Koa from 'koa'
import tracer from 'tracer';
import views from 'koa-views'
import serve from 'koa-static'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-koa2-middleware'
import webpackHotMiddleware from './webpack-hot-middleware'
import webpackHotServerMiddleware from './webpack-hot-server-middleware'
const clientConfig = require('../webpack/client.dev')
const serverConfig = require('../webpack/server.dev')
const publicPath = clientConfig.output.publicPath
const log = tracer.colorConsole({ level: 'info' })
const DEV = process.env.NODE_ENV === 'development'
const app = new Koa();
let isBuilt = false

const done = () =>
    !isBuilt &&
    app.listen(3000, () => {
        isBuilt = true
        log.info('Listening on 3000');
    })
app.use(views('views', {
    root: __dirname + '/views',
    default: 'hbs',
    map: { hbs: 'handlebars' }
}));
app.use(serve(__dirname + '/static'));

if (DEV) {
    const compiler = webpack([clientConfig, serverConfig])
    const clientCompiler = compiler.compilers[0]
    const options = { publicPath, serverSideRender: true, stats: { colors: true } }

    app.use(webpackMiddleware(compiler, options))
    app.use(webpackHotMiddleware(clientCompiler))
    app.use(webpackHotServerMiddleware(compiler))
    compiler.plugin('done', done)
}
