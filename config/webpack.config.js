const path = require('path');
const { globSync } = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const production = process.env.NODE_ENV === 'production';
const root = path.resolve(__dirname, '..');
const entry = {};
for (const file of globSync('src/js/**/*.js', { cwd: root })) {
  if (!/^src\/js\/(lib|commons)\//.test(file)) {
    entry[file.slice('src/js/'.length, -3)] = path.resolve(root, file);
  }
}
const pages = globSync('src/view/**/*.html', { cwd: root }).map(file => {
  const name = file.slice('src/view/'.length, -5);
  return new HtmlWebpackPlugin({
    filename: file.slice('src/'.length),
    template: path.resolve(root, file),
    chunks: ['common', name],
    minify: production ? { removeComments: true, minifyCSS: true, minifyJS: true } : false
  });
});
module.exports = {
  mode: production ? 'production' : 'development',
  entry,
  output: {
    path: path.resolve(root, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].js',
    publicPath: production ? '//cdn.com/' : '/',
    clean: true
  },
  module: { rules: [
    { test: /\.js$/i, exclude: /node_modules/, use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } } },
    { test: /\.(less|css)$/i, use: [MiniCssExtractPlugin.loader, 'css-loader', { loader: 'postcss-loader', options: { postcssOptions: require('./postcss.config') } }, 'less-loader'] },
    { test: /\.(png|jpe?g|gif|svg|eot|ttf|woff2?)$/i, type: 'asset', parser: { dataUrlCondition: { maxSize: 100 } }, generator: { filename: '[path][name].[contenthash:8][ext]' } },
    { test: /\.(htm|html|art)$/i, loader: 'art-template-loader', options: { minimize: false, imports: require.resolve('./template-runtime') } }
  ] },
  resolve: { alias: { views: path.resolve(root, 'src/view') } },
  externals: { jquery: 'jQuery' },
  optimization: {
    splitChunks: { cacheGroups: { common: { name: 'common', chunks: 'all', minChunks: 3, enforce: true } } },
    minimizer: ['...', new ImageMinimizerPlugin({ minimizer: { implementation: ImageMinimizerPlugin.sharpMinify, options: { encodeOptions: { jpeg: { quality: 65 }, png: { quality: 90 } } } } })]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash:8].css' }),
    new CopyWebpackPlugin({ patterns: [...['queries.min.js', 'zepto.min.js'].map(name => ({ from: path.resolve(root, 'src/js/lib', name), to: 'js/lib/' + name })), { from: path.resolve(root, 'src/css/*.css'), to: 'css/[name][ext]' }, { from: path.resolve(root, 'src/font'), to: 'font' }] }),
    ...pages
  ],
  devServer: {
    static: { directory: path.resolve(root, 'src') },
    host: '127.0.0.1', port: 9000, hot: false,
    proxy: [{ context: ['/api'], target: 'http://httpbin.org', changeOrigin: true, pathRewrite: { '^/api': '' } }]
  }
};
