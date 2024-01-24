import tailwindStyles from './style'

const cache = {}

function _s(classes) {
  if (typeof classes !== 'string') {
    classes = classes[0]
  }
  if (classes in cache) {
    return cache[classes]
  }
  const classList = classes
    .split(' ')
    .map(v => v.trim())
    .filter(Boolean)
  const styles = classList.map(c => {
    const ret = tailwindStyles[c]
    if (!ret) {
      throw new Error(`class ${c} does not exist in generated tailwindStyles`)
    }
    return ret
  })

  cache[classes] = styles
  return styles
}

function tw(classes, style) {
  if (!classes) {
    return null
  }
  const twStyles = _s(classes)
  if (!style) {
    return twStyles
  }
  if (Array.isArray(style)) {
    return [...twStyles, ...style]
  }
  return [...twStyles, style]
}

window.tw = tw

export default tw
