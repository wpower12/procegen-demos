const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		'text_00_markov': './src/js/text_00_markov.js',
		'dungeons_00_simple': './src/js/dungeons_00_simple.js'
	},
	output: {
	    path: path.resolve(__dirname, 'dist/js'),
	    filename: '[name].bundle.js'
    },
    devServer: {
	    static: {
	      directory: path.join(__dirname, 'dist'),
	    },
	    compress: true,
	    port: 9000,
  	}
};