const assert = require('node:assert/strict')
const test = require('node:test')
const postcss = require('postcss')
const plugin = require('../src/postcss-plugin')
const postcssCustomProperties = require('postcss-custom-properties')

test('css-base-1', async t => {
  const cssObject = {}
  await postcss([
    postcssCustomProperties(),
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
.dark\:aa {
	--foo-bar: red;
	color: var(--foo-bar);
}
`,
    { from: undefined }
  )

  assert.deepStrictEqual(cssObject, {
    'text-red': {
      color: 'red',
    },
    'font-bold': {
      fontWeight: 'bold',
    },
    'dark:aa': {
      color: 'red',
    },
  })
})
