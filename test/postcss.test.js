const assert = require('node:assert/strict');
const test = require('node:test');
const postcss = require('postcss');
const plugin = require('../src/postcss-plugin');

test('css-base-1', async t => {
	const cssObject = {};
	await postcss([
		plugin({
			cssObject,
		}),
	]).process(
		`
.text-red {
  color: red;
}

.font-bold {
  font-weight: bold;
}
`,
		{from: undefined},
	);

	assert.deepStrictEqual(cssObject, {
		'text-red': {
			color: 'red',
		},
		'font-bold': {
			fontWeight: 'bold',
		},
	});
});
