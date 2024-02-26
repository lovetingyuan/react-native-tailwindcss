#!/usr/bin/env node

const cp = require('node:child_process')

const tailwindcss = require.resolve('tailwindcss/tailwind.css')
const genStyle = require('./gen-style')

function buildTailwindCSS(root) {
  const out = cp.execSync(`npx tailwindcss --no-autoprefixer -i ${tailwindcss}`, {
    cwd: root || process.cwd(),
  })
  genStyle(out.toString())
}

module.exports = buildTailwindCSS

if (require.main === module) {
  buildTailwindCSS()
}
