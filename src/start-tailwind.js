#!/usr/bin/env node

const fs = require('node:fs')
const genStyle = require('./gen-style')

function debounce(function_, delay) {
  let timer
  return function (...arguments_) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      function_.call(this, ...arguments_)
    }, delay)
  }
}

function startTailwind(root) {
  // If (process.env.NODE_ENV === 'development') {
  const spawn = require('cross-spawn')
  const tailwindcss = require.resolve('tailwindcss/tailwind.css')
  // 启动tailwindcss进程
  const child = spawn('npx', `tailwindcss --no-autoprefixer -i ${tailwindcss} --watch`.split(' '), {
    cwd: root || process.cwd(),
  })
  let css = ''
  const writeToCss = process.argv.slice(2).find(v => v.startsWith('--write'))

  const handleCssChange = debounce(css => {
    if (writeToCss) {
      let file = writeToCss.split('=')[1] || 'tailwind.css'
      if (!file.endsWith('.css')) {
        file += '.css'
      }

      fs.writeFileSync(file, css)
    }

    genStyle(css)
  }, 500)

  child.stderr.on('data', data => {
    console.log('TailwindCSS: ' + data.toString().trim())
  })

  child.stdout.on('data', data => {
    const cssData = data.toString()
    if (cssData.startsWith('/*') && cssData.includes('MIT License | https://tailwindcss.com')) {
      css = cssData
    } else {
      css += cssData
    }

    handleCssChange(css)
  })
}

module.exports = startTailwind

if (require.main === module) {
  startTailwind()
}
