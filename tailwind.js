module.exports = function tailwind(root, development = process.env.NODE_ENV === 'development') {
	if (development) {
		require('./src/start-tailwind')(root);
	} else {
		require('./src/build-tailwind')(root);
	}
};
