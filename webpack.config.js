const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 用于抽离css（打包之后会有一个main.css文件，页面中用link标签引入该css文件）
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')  // 用于压缩css
const toml = require('toml')
const yaml = require('yaml')
const json5 = require('json5')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = (env) => {
  console.log(env, 'env')
  return {
    // entry: './src/index.js', // 打包入口（单入口）
    entry: {  // 多入口（默认会把共同引用的代码重复打包到各自的bundle里，比如共同引用了lodash）
      index: {
        import: './src/index.js',
        dependOn: 'shared'  // 共享的代码
      },
      other: {
        import: './src/other.js',
        dependOn: 'shared'
      },
      shared: 'lodash'
    },

    output: {
      // filename: 'bundle.js',  // 打包后的文件名
      filename: 'scripts/[name].[contenthash].js', // [name]可以拿到入口文件的名字（部署新版本时，不更改资源文件名，浏览器可能会认为并没有更新，会使用缓存版本，所以拼接contenthash）
      path: path.resolve(__dirname, './dist'),  // 打包后的路径，需要用绝对路径
      clean: true, // 重新打包后，删除上一次打包出来的文件
      assetModuleFilename: 'images/[contenthash][ext]',  // 指定资源存放的路径（images），用wepack自带的生成文件名方法（[contenthash]根据文件命名生成哈希字符串，[ext]表示扩展名）
      publicPath: ''
    },

    // mode: 'production',
    mode: env.production ? 'prodiction' : 'development',

    devtool: 'inline-source-map', // 可以定位到错误所在的真实位置

    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html', // 以index文件为模板
        filename: 'app.html', // 生成的文件名称
        inject: 'body'  // 将生成的script标签挂载到body节点下
      }),
      new MiniCssExtractPlugin({
        filename: 'styles/[contenthash].css'
      })
    ],

    devServer: {  // 可以自动刷新页面
      static: './dist'
    },

    module: {
      rules: [
        {
          test: /\.png$/,
          type: 'asset/resource', // 生成单独的文件，并导出url
          generator: {  // 指定资源存放的路径（images），用wepack自带的生成文件名方法（[contenthash]根据文件命名生成哈希字符串，[ext]表示扩展名）。优先级高于output里的'assetModuleFilename'
            filename: 'images/[contenthash][ext]'
          }
        },
        {
          test: /\.svg$/,
          type: 'asset/inline'  // 导出资源的dataUrl
        },
        {
          test: /\.txt$/,
          type: 'asset/source'  // 导出资源的源代码
        },
        {
          test: /\.jpg$/,
          type: 'asset',  // 通用资源类型，自动在resource和inline之间做选择，小于8kb的文件会被视为inline模块类型，大于8kn的文件会被视为resource模块类型
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024 * 1024  // 手动修改，当图片大小大于4M的时候，才生成resource资源文件，否则生成base64
            }
          }
        },
        {
          test: /\.(css|less)$/,
          // use: ['style-loader', 'css-loader', 'less-loader'] // 顺序从后往前加载（顺序不可颠倒），先用less-loader解析css文件，再执行css-loader，再执行style-loader

          // 单独抽离css，style-loader失效，改为MiniCssExtractPlugin.loader
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
        },
        { // 用于加载fonts字体
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource'
        },
        { // 用于加载csv,tsv文件（会被转化为一个数组）
          test: /\.(csv|tsv)$/,
          use: 'csv-loader'
        },
        { // 用于加载xml文件（会被转化为一个对象）
          test: /\.xml$/,
          use: 'xml-loader'
        },
        { // 用于加载toml文件
          test: /\.toml$/,
          type: 'json',
          parser: {
            parse: toml.parse
          }
        },
        { // 用于加载yaml文件
          test: /\.yaml$/,
          type: 'json',
          parser: {
            parse: yaml.parse
          }
        },
        { // 用于加载json5文件
          test: /\.json5$/,
          type: 'json',
          parser: {
            parse: json5.parse
          }
        },
        { // babel编译js文件
          test: /\.js$/,
          exclude: /node_modules/,  // node_modules文件夹下的js文件不需要编译
          use: {
            loader: 'babel-loader',
            options: {
              preset: ['@babel/preset-env'],
              plugins: [
                ['@babel/plugin-transform-runtime']
              ]
            }
          }
        }
      ]
    },

    optimization: { // 优化 
      minimizer: [
        new CssMinimizerPlugin(),  // 压缩css文件，前面的mode要改为production才会生效
        new TerserPlugin()
      ],
      splitChunks: {  // 拆分代码
        // chunks: 'all'
        cacheGroups: {  // 缓存第三方库（node_modules文件夹下的资源）
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all'
          }
        }
      }
    },

    performance: {
      hints: false  // 关闭生产环境下，资源大小超出提示
    }
  }
}