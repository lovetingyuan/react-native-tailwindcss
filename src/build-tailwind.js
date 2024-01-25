#!/usr/bin/env node

const cp = require('child_process')
const tailwindcss = require.resolve('tailwindcss/tailwind.css')
const genStyle = require('./gen-style')

const out = cp.execSync(`npx tailwindcss --no-autoprefixer -i ${tailwindcss}`, {
  cwd: process.cwd(),
})

genStyle(out.toString())
