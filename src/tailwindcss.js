import tailwindStyles from './style'
import { StyleSheet, Appearance } from 'react-native'

const cache = {}

Appearance.addChangeListener(() => {
  Object.keys(cache).forEach(k => {
    if (k.includes('dark:')) {
      delete cache[k]
    }
  })
})

function _s(classes) {
  if (typeof classes !== 'string') {
    classes = classes[0]
  }
  if (classes in cache) {
    return cache[classes]
  }
  const isDark = Appearance.getColorScheme() === 'dark'
  const styles = classes
    .split(/\s+/)
    .map(v => v.trim())
    .filter(v => {
      if (!v) {
        return false
      }
      if (!isDark && v.startsWith('dark:')) {
        return false
      }
      return true
    })
    .map(c => {
      const ret = tailwindStyles[c]
      if (!ret) {
        throw new Error(
          `@tingyuan/react-native-tailwindcss: class ${c} does not exist in generated tailwind styles.( node_modules/@tingyuan/react-native-tailwindcss/src/style.js )`
        )
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
