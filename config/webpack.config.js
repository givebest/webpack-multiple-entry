const path = require('path');
const webpack = require('webpack');
const ROOT = process.cwd();  // 根目录
const ENV = process.env.NODE_ENV;
const IsProduction = (ENV === 'production') ? true : false;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PostcssConfigPath = './config/postcss.config.js';
const Glob = require('glob');
const HappyPack = require('happypack');
const HappyThreadPool = HappyPack.ThreadPool({ size: (IsProduction ? 10 : 4) });
const CopyWebpackPlugin = require('copy-webpack-plugin');
const staticUrl = '//cdn.com';
const publicPath = IsProduction ? staticUrl : '/';
const extraPath = IsProduction ? '/' : '';


let entryHtml = getEntryHtml('./src/view/**/*.html'),
	entryJs = getEntry('./src/js/**/*.js'),
	configPlugins = [
		// @see https://doc.webpack-china.org/plugins/provide-plugin/
		// jQuery 设为自动加载，不必 import 或 require
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		new HappyPack({
			id: 'js',
			// @see https://github.com/amireh/happypack
			threadPool: HappyThreadPool,
			loaders: ['babel-loader']
		}),
		new HappyPack({
			id: 'styles',
			threadPool: HappyThreadPool,
			loaders: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader']
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			minChunks: 3 // 包含 3 次即打包到 commons chunk @see https://doc.webpack-china.org/plugins/commons-chunk-plugin/
		}),
		// @see https://github.com/webpack/webpack/tree/master/examples/multiple-entry-points-commons-chunk-css-bundle
		new ExtractTextPlugin({
			filename: 'css/[name].css?[contenthash:8]',
			allChunks: true
		}),
		// 手动 copy 一些文件
		// @see https://github.com/kevlened/copy-webpack-plugin
		new CopyWebpackPlugin([
			{
				from:  'src/js/lib/queries.min.js',
				to: 'js/lib/queries.min.js'
			}
		]),
	];

// html
entryHtml.forEach(function (v) {
	configPlugins.push(new HtmlWebpackPlugin(v));
});

// 开发环境不压缩 js
if (IsProduction) {
	configPlugins.push(new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	}));
}

// 配置
const config = {
	entry: entryJs,
	// @see https://github.com/webpack-contrib/extract-text-webpack-plugin/blob/master/example/webpack.config.js
	output: {
		filename: 'js/[name].js?[chunkhash:8]',
		chunkFilename: 'js/[name].js?[chunkhash:8]',
		path: path.resolve(ROOT, 'dist'),
		publicPath: publicPath
	},
	module: {
		// @see https://doc.webpack-china.org/configuration/module/#module-noparse
		// 排除不需要 webpack 解析的文件，提高速度
		/* noParse: function (content) {
			return /jquery|zepto/.test(content);
		}, */
		noParse: /jquery|lodash|zepto/,
		rules: [
			{
				test: /\.js$/i,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader?id=js',
					options: {
						presets: ['env']
					}
				}
			},
			{
				test: /\.(less|css)$/i,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader?id=styles',
					use: [{
							loader: 'css-loader?id=styles',
							options: {
								minimize:  IsProduction
							}
						},
						{
							loader: 'less-loader?id=styles'
						},
						{
							loader: 'postcss-loader?id=styles',
							options: {
								config: {
									path: PostcssConfigPath
								}
							}
						}
					]
				})
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 100,
							publicPath: publicPath + extraPath,
              outputPath: function (path) {
                return path.replace('src/img', 'img');
              },
							name: '[path][name].[ext]?[hash:8]'
						}
					},
          // @see https://github.com/tcoopman/image-webpack-loader
          {
            loader: 'image-webpack-loader',
            query: {
              mozjpeg: {
                quality: 65
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }
				]
			},
			{
				test: /\.(eot|svg|ttf|woff)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 100,
							publicPath: publicPath + extraPath,
							name: 'font/[name].[ext]?[hash:8]'
						}
					}
				]
			},
      // @see http://aui.github.io/art-template/webpack/index.html#Options
      {
        test: /\.(htm|html|art)$/i,
        loader: 'art-template-loader',
        options: {}
      },
			// @see https://github.com/wzsxyz/html-withimg-loader
			/*{
				test: /\.(htm|html)$/i,
				loader: 'html-withimg-loader?min=false'
			}*/
		]
	},
	resolve: {
		alias: {
			views:  path.resolve(ROOT, './src/view')
		}
	},
	plugins: configPlugins,
	// @see http://webpack.github.io/docs/webpack-dev-server.html
	// @see http://www.css88.com/doc/webpack2/configuration/dev-server/
	devServer: {
		contentBase: [
			path.join(ROOT, 'src/')
		],
		disableHostCheck: true,  // https://stackoverflow.com/questions/43650550/invalid-host-header-in-when-running-react-app
		hot: false,
		host: '0.0.0.0',
		port: 8080,
		/*proxy: {
		  "/m/public": {
		  	target: "http://localhost:8080",
		  	pathRewrite: {
		  		"^/m/public" : ""
		  	}
		  }
		}*/
	}
};

/**
 * 根据目录获取入口
 * @param  {[type]} globPath [description]
 * @return {[type]}          [description]
 */
function getEntry (globPath) {
	let entries = {};
	Glob.sync(globPath).forEach(function (entry) {
		let basename = path.basename(entry, path.extname(entry)),
			pathname = path.dirname(entry);
		// js/lib/*.js 不作为入口
		if (!entry.match(/\/js\/(lib|commons)\//)) {
			entries[pathname.split('/').splice(3).join('/') + '/' + basename] = pathname + '/' + basename;
		}
	});
	return entries;
}

/**
 * 根据目录获取 Html 入口
 * @param  {[type]} globPath [description]
 * @return {[type]}          [description]
 */
function getEntryHtml (globPath) {
	let entries = [];
	Glob.sync(globPath).forEach(function (entry) {
		let basename = path.basename(entry, path.extname(entry)),
			pathname = path.dirname(entry),
			// @see https://github.com/kangax/html-minifier#options-quick-reference
			minifyConfig = !IsProduction ? '' : {
				removeComments: true,
				// collapseWhitespace: true,
				minifyCSS: true,
				minifyJS: true
			};

		entries.push({
			filename: entry.split('/').splice(2).join('/'),
			template: entry,
			chunks: ['common', pathname.split('/').splice(3).join('/') + '/' + basename],
			minify: minifyConfig
		});

	});
	return entries;
}

module.exports = config;
