module.exports = function tailwind(root, dev = process.env.NODE_ENV === 'development') {
  if (dev) {
    require('./src/start-tailwind')(root)
  } else {
    require('./src/build-tailwind')(root)
  }
}
