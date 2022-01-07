const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		'text_00_ngrams': './src/js/language/00_ngrams.js',
		'text_01_better': './src/js/language/01_better_ngrams.js',
		'dungeons_00_simple': './src/js/dungeons/00_simple.js',
		'terrain_00_basic_noise': './src/js/terrain/00_basic_noise.js',
		'terrain_01_noise_clouds': './src/js/terrain/01_noise_clouds.js',
		'terrain_02_local_points': './src/js/terrain/02_local_points.js',
		'images_00_l_systems': './src/js/images/00_l_systems.js'
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