const path = require('path')
const fs = require('fs')
const postcss = require('postcss')
const cssvariables = require('postcss-css-variables')
const totailwind = require('./postcss-plugin')

module.exports = function genStyle(css) {
  const cssObject = {}
  const breakPoints = {}
  postcss([
    cssvariables(/*options*/),
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
      // const styles = JSON.stringify(cssObject, null, 2)
      // .replaceAll('"@@@', '')
      // .replaceAll('@@@"', '')
      const styleCode = [
        `export const styleSheets = ${JSON.stringify(cssObject, null, 2)}`,
        `export const breakPoints = ${JSON.stringify(breakPoints, null, 2)}`,
      ].join('\n')
      fs.writeFileSync(path.resolve(__dirname, 'styles.js'), styleCode)
    })
    .catch(err => {
      console.log(err)
      console.error('postcss error')
      process.exit(-1)
    })
}
