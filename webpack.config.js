const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

let extractTextPlugin = new ExtractTextPlugin({
	filename: 'main.css',
	disable: false,
	allChunks: true,
});

const outputPath = `${__dirname}/dist`;

module.exports = () => {
	return {
		mode: process.env.NODE_ENV || 'development',
		entry: ['./index.js','./src/assets/stylesheets/main.scss'],
		output: {
			filename: 'bundle.js',
			path: outputPath,
			publicPath: '/',
		},
		resolve: {
			extensions: ['.jsx', '.js', '.json'],
		},
		node: {
			__dirname: false,
			__filename: false,
		},
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.(png|jpe?g|gif)$/i,
					use: [{ loader: 'url-loader', options: { limit: 10000 } }],
				},
				{
					test: /\.(scss|css)/,
					loader: extractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								options: {
									minimize: true,
									includePaths: ['node_modules']
								}
							},
							{
								loader: 'sass-loader',
								options: {
									includePaths: ['node_modules']
								}
							},
						]
					})
				},
				{
					test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
					use: [{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/'
						}
					}]
				}
			],
		},
		optimization: {
			minimize: process.env.NODE_ENV === 'production',
		},
		devServer: {
			contentBase: './dist',
			hot: true,
			disableHostCheck: true
		},
		plugins: [
			new CopyWebpackPlugin([
				{ from: 'index.html', to: `${outputPath}/index.html` },
        { from: './src/assets/images', to: `${outputPath}/assets/images` },
      ]),
      new webpack.HotModuleReplacementPlugin(),
      extractTextPlugin,
    ],
  };
};

