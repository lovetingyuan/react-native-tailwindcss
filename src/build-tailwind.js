#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const cp = require('child_process')
const tailwindcss = require.resolve('tailwindcss/tailwind.css')
const postcss = require('postcss')
const cssvariables = require('postcss-css-variables')
const totailwind = require('./postcss-plugin')

const out = cp.execSync(`npx tailwindcss --no-autoprefixer -i ${tailwindcss}`, {
  cwd: process.cwd(),
})

const cssObject = {}

postcss([
  cssvariables(/*options*/),
  totailwind({
    cssObject,
    ignoreClasses: ['transform', 'filter'],
  }),
])
  .process(out.toString(), {
    from: '',
    to: '',
  })
  .then(() => {
    const styleCode = `import { StyleSheet } from "react-native";\n\nexport default StyleSheet.create(${JSON.stringify(
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
