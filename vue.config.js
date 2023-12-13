'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')


const CompressionPlugin = require('compression-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, dir)
}
var webpack = require('webpack');

const name = process.env.VUE_APP_SYSTEM_FLAG == "ENERGY" ? "能源管理系统" : defaultSettings.title || '源创智联云平台' // 标题
const port = process.env.port || process.env.npm_config_port || 80 // 端口
// const px2rem = require('postcss-px2rem')
// 配置基本大小
// const postcss = px2rem({
//     remUnit: 192  //基准大小，1920*1080
// })
// vue.config.js 配置说明
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    publicPath: '/energy/',
    // publicPath: '../../',
    // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
    outputDir: 'energy',
    // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
    assetsDir: 'static',
    // 是否开启eslint保存检测，有效值：ture | false | 'error'
    lintOnSave: process.env.NODE_ENV === 'development',
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    productionSourceMap: false,
    // webpack-dev-server 相关配置
    devServer: {
        host: '0.0.0.0',
        port: port,
        open: true,
        hot: true, //自动保存
        proxy: {
            // detail: https://cli.vuejs.org/config/#devserver-proxy

            // 本地mock
            // ...['energySavingGroup'].reduce((result, item) => {
            //     result[`${process.env.VUE_APP_BASE_API}/energy/${item}`] = {
            //         target: `http://127.0.0.1:4523/m1/1754515-0-default`,
            //         changeOrigin: true,
            //         pathRewrite: {
            //             [`${process.env.VUE_APP_BASE_API}/energy`]: ''
            //         }
            //     }
            //     return result
            // }, {}),

            // 联调TC
            // [`${process.env.VUE_APP_BASE_API}/energy`]: {
            //     target: `http://192.168.1.166:9205`,
            //     changeOrigin: true,
            //     pathRewrite: {
            //         [`${process.env.VUE_APP_BASE_API}/energy`]: ''
            //     }
            // },

            [process.env.VUE_APP_BASE_API]: {
                // target: `http://127.0.0.1:8080`,
                // target: `http://115.29.201.75:8080`,
                target: `http://192.168.1.63:8080`,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            },
            '/bim-model': {
                target: 'http://8.136.204.163:8764/bim-model/',  // 后台api
                // target: 'http://localhost:8765/kjy/bim-model/',
                changeOrigin: true,  //是否跨域
                // secure: true,
                pathRewrite: {
                    '^/bim-model': ''   //需要rewrite的,
                }
            }
        },
        disableHostCheck: true
    },
    configureWebpack: {
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        plugins: [
            new CompressionPlugin({
                test: /\.(js|css)(\?.*)?$/i, //需要压缩的文件正则
                threshold: 10240, //文件大小大于这个值时启用压缩
                deleteOriginalAssets: false //压缩后保留原文件
            }),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 20,
            }),
        ],
        externals: {
            'AMap': 'AMap' // 高德地图配置
        }
    },
    chainWebpack(config) {
        config.plugins.delete('preload') // TODO: need test
        config.plugins.delete('prefetch') // TODO: need test

        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/assets/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/assets/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]',
            })
            .end()

        config
            .when(process.env.NODE_ENV !== 'development',
                config => {
                    config
                        .plugin('ScriptExtHtmlWebpackPlugin')
                        .after('html')
                        .use('script-ext-html-webpack-plugin', [{
                            // `runtime` must same as runtimeChunk name. default is `runtime`
                            inline: /runtime\..*\.js$/
                        }])
                        .end()
                    config
                        .optimization.splitChunks({
                            chunks: 'async',
                            cacheGroups: {
                                vendor: {
                                    test: /[\\/]node_modules[\\/]/,
                                    name(module) {
                                        // get the name. E.g. node_modules/packageName/not/this/part.js
                                        // or node_modules/packageName
                                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                                        // npm package names are URL-safe, but some servers don't like @ symbols
                                        return `npm.${packageName.replace('@', '')}`;
                                    },
                                    enforce: true,
                                    reuseExistingChunk: true
                                },
                            }
                        })
                    config.optimization.runtimeChunk('single'), {
                        from: path.resolve(__dirname, './public/robots.txt'), //防爬虫文件
                        to: './', //到根目录下
                    }
                }
            )
    },
    // lintOnSave: true,
    // css: {
    //     loaderOptions: {
    //         postcss: {
    //             plugins: [
    //                 require("postcss-px2rem")({
    //                     remUnit: 16
    //                 })
    //             ]
    //         }
    //     }
    // }
    css: {
        sourceMap: true
    }

}
