const path = require('path')
const TransformPages = require('uni-read-pages')
const { webpack } = new TransformPages()
// 包分析插件(分析模块时打开)
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        ROUTES: webpack.DefinePlugin.runtimeValue(() => {
          const tfPages = new TransformPages({
            includes: ['path', 'name', 'meta', 'aliasPath']
          })
          return JSON.stringify(tfPages.routes)
        }, true)
      }),
      // new BundleAnalyzerPlugin()
      // 确保导出文件不会被删除
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, 'src/pages/registration/exports'),
          to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'pages/registration/exports')
        }
      ])

    ]
  },
  chainWebpack: config => {
    // 增强代码压缩和清理
    module.exports = {
      configureWebpack: {
        optimization: {
          splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 244000,
            cacheGroups: {
              vendor: {
                name: 'vendor',
                test: /[\\\/]node_modules[\\\/]/,
                chunks: 'all',
                priority: 10,
                enforce: true
              },
              common: {
                name: 'common',
                minChunks: 2,
                chunks: 'all',
                priority: 5
              }
            }
          },
          usedExports: true,
          sideEffects: false
        }
      },
      chainWebpack: config => {
        // 移除所有console
        config.optimization.minimizer('terser').tap((args) => {
          const compress = args[0].terserOptions.compress
          compress.drop_console = true
          compress.drop_debugger = true
          compress.pure_funcs = ['console.log', 'console.info', 'console.debug', '__f__']
          compress.unused = true
          compress.dead_code = true
          return args
        })
      }
    }
  },
  // 配置全局样式变量
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, './src/styles/base.scss')]
    }
  },
  transpileDependencies: ['uview-ui']
}
