import {
  StyleSheet,
  Appearance,
  useColorScheme,
  Dimensions,
  useWindowDimensions,
} from 'react-native'
import { styleSheets, breakPoints } from './styles'

const classes = Object.keys(styleSheets)
for (const cls of classes) {
  const styleObj = styleSheets[cls]
  const props = Object.keys(styleObj)
  for (const prop of props) {
    const value = styleObj[prop]
    if (/^\d+v[hw]$/.test(value)) {
      delete styleObj[prop]
      const num = parseFloat(value, 10)
      const vw = value.endsWith('vw')
      Object.defineProperty(styleObj, prop, {
        get() {
          const { width, height } = Dimensions.get('window')
          return (num * (vw ? width : height)) / 100
        },
        enumerable: true,
        configurable: true,
      })
    }
  }
}

const styles = StyleSheet.create(styleSheets)

const bps = Object.keys(breakPoints)
for (const bp of bps) {
  let condition = breakPoints[bp]
  if (condition.startsWith('not ')) {
    condition = condition.replace('not ', '!( ') + ')'
  }
  const jsExpression = condition
    // .replace(/\s/g, '') // 去除空格
    .replace(/min-width:/g, 'w>=') // 替换 min-width: 为 width>=
    .replace(/max-width:/g, 'w<=') // 替换 max-width: 为 width<=
    .replace(/px/g, '') // 去除 px 单位
    .replace(/ and /g, ' && ') // 替换 and 为 &&
    .replace(/ all /g, ' true ')
  breakPoints[bp] = new Function('w', `return ${jsExpression}`)
}

const cache = {}

function _s(classes) {
  if (typeof classes !== 'string') {
    classes = classes[0]
  }

  const isDark = Appearance.getColorScheme() === 'dark'
  const { width, height } = Dimensions.get('window')
  const finalClassList = classes
    .split(/\s+/)
    .map(v => v.trim())
    .filter(v => {
      if (!v) {
        return false
      }
      if (!isDark && v.startsWith('dark:')) {
        return false
      }
      if (v.startsWith('landscape:') && width < height) {
        return false
      }
      if (v.startsWith('portrait:') && width >= height) {
        return false
      }
      if (/^(xs|sm|md|lg|xl|2xl|3xl):/.test(v)) {
        const [bp] = v.split(':')
        if (!breakPoints[bp]) {
          throw new Error(`break point "${bp}" is not found.`)
        }
        return breakPoints[bp](width)
      }
      return true
    })

  const finalClasses = finalClassList.join(' ')
  if (finalClasses in cache) {
    return cache[finalClasses]
  }
  const finalStyles = finalClassList.map(c => {
    const ret = styles[c]
    if (!ret) {
      throw new Error(
        `@tingyuan/react-native-tailwindcss: class "${c}" does not exist in generated tailwind styles.( node_modules/@tingyuan/react-native-tailwindcss/src/style.js )`
      )
    }
    return ret
  })
  const style = StyleSheet.flatten(finalStyles)
  cache[finalClasses] = style
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

export function useTw() {
  useColorScheme()
  useWindowDimensions()
  return tw
}
