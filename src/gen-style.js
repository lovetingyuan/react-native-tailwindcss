const path = require('path')
const fs = require('fs')
const postcss = require('postcss')
const cssvariables = require('postcss-css-variables')
const totailwind = require('./postcss-plugin')

module.exports = function genStyle(css) {
  const cssObject = {}
  postcss([
    cssvariables(/*options*/),
    totailwind({
      cssObject,
      ignoreClasses: ['transform', 'filter'],
    }),
  ])
    .process(css, {
      from: '',
      to: '',
    })
    .then(() => {
      const styleCode = `import { StyleSheet } from "react-native"\n\nexport default StyleSheet.create(${JSON.stringify(
        cssObject,
        null,
        2
      )})`
      fs.writeFileSync(path.resolve(__dirname, 'style.js'), styleCode)
    })
    .catch(err => {
      console.log(err)
      console.error('postcss error')
      process.exit(-1)
    })
}
