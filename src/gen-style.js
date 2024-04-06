const path = require('node:path')
const fs = require('node:fs')
const postcss = require('postcss')
// const cssvariables = require('postcss-css-variables')
const postcssCustomProperties = require('postcss-custom-properties')
const totailwind = require('./postcss-plugin')

module.exports = function genStyle(css) {
  css = css.replace('*, ::before, ::after {', '*, ::before, ::after, :root {')
  const cssObject = {}
  const breakPoints = {}
  postcss([
    // cssvariables(/* options */),
    postcssCustomProperties(),
    totailwind({
      cssObject,
      breakPoints,
      ignoreClasses: ['transform', 'filter'],
    }),
  ])
    .process(css, {
      from: '',
      to: '',
    })
    .then(() => {
      // Const styles = JSON.stringify(cssObject, null, 2)
      // .replaceAll('"@@@', '')
      // .replaceAll('@@@"', '')
      const styleCode = [
        `export const styleSheets = ${JSON.stringify(cssObject, null, 2)}`,
        `export const breakPoints = ${JSON.stringify(breakPoints, null, 2)}`,
      ].join('\n')
      fs.writeFileSync(path.resolve(__dirname, 'styles.js'), styleCode)
    })
    .catch(error => {
      console.log(error)
      console.error('postcss error')
      process.exit(-1)
    })
}
