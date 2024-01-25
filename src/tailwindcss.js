import tailwindStyles from './style'
import { StyleSheet } from 'react-native'

const cache = {}

function _s(classes) {
  if (typeof classes !== 'string') {
    classes = classes[0]
  }
  if (classes in cache) {
    return cache[classes]
  }
  const styles = classes
    .split(/\s+/)
    .map(v => v.trim())
    .filter(Boolean)
    .map(c => {
      const ret = tailwindStyles[c]
      if (!ret) {
        throw new Error(`class ${c} does not exist in generated tailwindStyles`)
      }
      return ret
    })
  const style = StyleSheet.flatten(styles)
  cache[classes] = style
  return style
}

function tw(classes, ...styles) {
  if (!classes) {
    return null
  }
  const twStyles = _s(classes)
  if (!styles.length) {
    return twStyles
  }
  return StyleSheet.flatten([twStyles, ...styles])
}

window.tw = tw

export default tw
