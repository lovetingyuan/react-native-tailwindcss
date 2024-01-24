#!/usr/bin/env node

const path = require('path')
const fs = require('fs')

function debounce(func, delay) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.call(this, ...args)
    }, delay)
  }
}

function startTailwind(root) {
  // if (process.env.NODE_ENV === 'development') {
  const spawn = require('cross-spawn')

  const postcss = require('postcss')
  const cssvariables = require('postcss-css-variables')
  const totailwind = require('./postcss-plugin')
  const tailwindcss = require.resolve('tailwindcss/tailwind.css')
  // 启动tailwindcss进程
  const child = spawn(
    'npx',
    `tailwindcss --no-autoprefixer -i ${tailwindcss} --watch`.split(' '),
    {
      cwd: root,
    },
  )
  let css = ''

  const handleCssChange = debounce(css => {
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
        const styleCode = `import { StyleSheet } from "react-native";\n\nexport default StyleSheet.create(${JSON.stringify(
          cssObject,
          null,
          2,
        )})`
        fs.writeFileSync(path.resolve(__dirname, 'style.js'), styleCode)
      })
      .catch(err => {
        console.log(err)
        console.error('postcss error')
        process.exit(-1)
      })
  }, 500)

  child.stderr.on('data', data => {
    console.log('TailwindCSS: ' + data.toString().trim())
  })

  child.stdout.on('data', data => {
    const cssData = data.toString()
    if (
      cssData.startsWith('/*') &&
      cssData.includes('MIT License | https://tailwindcss.com')
    ) {
      css = cssData
    } else {
      css += cssData
    }
    handleCssChange(css)
  })
}

module.exports = startTailwind

if (require.main === module) {
  startTailwind(process.cwd())
}
