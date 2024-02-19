const fs = require('node:fs')

const files = fs.readdirSync(__dirname).filter(v => v.endsWith('.test.js') && !v.startsWith('_'))

for (const file of files) {
  require(__dirname + '/' + file)
}
