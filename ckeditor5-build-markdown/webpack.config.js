// https://webpack.js.org/configuration/dev-server/

const path = require('path');
const webpack = require('webpack');
const { bundler, styles } = require('@ckeditor/ckeditor5-dev-utils');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isDevServer = process.env.WEBPACK_DEV_SERVER;

module.exports = {
	devtool: 'source-map',
	performance: { hints: false },

	entry: path.resolve(__dirname, 'src', 'ckeditor.js'),

	output: {
		// The name under which the editor will be exported.
		library: 'MarkdownEditor',

		path: path.resolve(__dirname, 'build'),
		filename: 'ckeditor.js',
		libraryTarget: 'umd',
		libraryExport: 'default',
	},
	devServer: {
		static: [
			// eg. /src/ckeditor.js will be served at /ckeditor.js
			{
				directory: path.join(__dirname, 'src'),
				watch: true,
				publicPath: '/',
				serveIndex: true,
			},
			{
				directory: path.join(__dirname, 'sample'),
				watch: true,
				publicPath: '/',
				serveIndex: true,
			},
		],
		compress: true,
		open: true,
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				sourceMap: true,
				terserOptions: {
					output: {
						// Preserve CKEditor 5 license comments.
						comments: /^!/,
					},
				},
				extractComments: false,
			}),
		],
	},

	plugins: [
		// Disable CKEditorWebpackPlugin when running the dev server since it clears the translations `outputDirectory`
		// See https://github.com/ckeditor/ckeditor5/issues/700 for more information.
		...(isDevServer
			? []
			: [
					new CKEditorWebpackPlugin({
						// UI language. Language codes follow the https://en.wikipedia.org/wiki/ISO_639-1 format.
						// When changing the built-in language, remember to also change it in the editor's configuration (src/ckeditor.js).
						language: 'en',
						// additionalLanguages: 'all',
					}),
			  ]),
		new webpack.BannerPlugin({
			banner: bundler.getLicenseBanner(),
			raw: true,
		}),
	],

	module: {
		rules: [
			{
				test: /\.svg$/,
				use: ['raw-loader'],
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							injectType: 'singletonStyleTag',
							attributes: {
								'data-cke': true,
							},
						},
					},
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: styles.getPostCssConfig({
								themeImporter: {
									themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
								},
								minify: true,
							}),
						},
					},
				],
			},
		],
	},
};
