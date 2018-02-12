//webpack.base config
const webpack = require('webpack')
const path = require('path')
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const htmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PROT = process.env.PROT || 8000

// 多线程
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

//提取公共文件
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin

//配置开始
const config = {
    entry: {
        main:[
            'babel-polyfill',
            path.resolve(__dirname, '../src/index.js')
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: '/node_modules/',
            loader: [ 'happypack/loader?id=js' ]
        },
        {
            test: /\.scss$/, 
            loader: [ 'happypack/loader?id=sass' ]
        },
        {
            test: /\.less$/,
            loader: [ 'happypack/loader?id=less' ]
        },
        {
            test:/\.css$/, 
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader:'css-loader',
                    options:{minimize:false}
                }]
            })
        },
        {
            test: /\.less/,
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader:'css-loader',
                    options:{minimize:false}
                },{
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [autoprefixer({ browsers: ['iOS >= 7', 'Android >= 4.1', 'last 10 Chrome versions', 'last 10 Firefox versions', 'Safari >= 6', 'ie > 8'] })
                        // ,pxtorem({
                        //     rootValue: 100,
                        //     minPixelValue: 1,
                        //     propWhiteList: [],
                        // })
                        ],
                    },
                },{
                    loader: 'less-loader'
                }]
            })
        },{
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader?limit=8192&name=img/[name].[ext]?[hash]'
        },{
            test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
            loader: 'url-loader?importLoaders=1&limit=1000&name=fonts/[name].[ext]'
        },{
            test: /\.(xlsx|xls)(\?.*$|$)/,
            loader: 'url-loader?importLoaders=1&limit=8192&name=files/[name].[ext]'
        }
        ]},
    //自动补全识别后缀
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
        },
    },
    //插件
    plugins: [
        //js 编译多线程 
        new HappyPack({
            id: 'js',
            threadPool: happyThreadPool,
            loaders: [{
                loader: 'babel-loader',
                options: {
                    presets: [ 'env','react' ,'flow'],
                    plugins: ['syntax-dynamic-import','transform-object-rest-spread']
                }
            },{
                loader:'eslint-loader',
                options: {
                    emitWarning: true,
                },
            }],
        }),
        // sass 编译多线程
        new HappyPack({
            id: 'sass',
            threadPool: happyThreadPool,
            loaders: [ 'style-loader', 'css-loader', 'sass-loader' ]
        }),
        // sass 编译多线程
        new HappyPack({
            id: 'less',
            threadPool: happyThreadPool,
            loaders: [ 'style-loader', 'css-loader', 'less-loader' ]
        }),
        //提取css
        new ExtractTextPlugin('styles.css'),
        new CommonsChunkPlugin({
            name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
            chunks: ['main'],
            minChunks: 1 // 提取所有entry共同依赖的模块
        }),
        //自动生成html文件
        new htmlWebpackPlugin({
            title:'首页',
            template:path.resolve(__dirname, '../src/index.html'),
            inject: true,
            hash: true,
            cache: true,
            chunks: ['main','vendors'],
            favicon:path.resolve(__dirname, '../favicon.ico'),
        }),
    ]
}

module.exports = config
