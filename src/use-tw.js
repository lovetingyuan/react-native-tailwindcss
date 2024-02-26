import {
  StyleSheet,
  Appearance,
  useColorScheme,
  Dimensions,
  useWindowDimensions,
  AppState,
} from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { styleSheets, breakPoints } from './styles.js'

const classes = Object.keys(styleSheets)
for (const cls of classes) {
  const styleObject = styleSheets[cls]
  const properties = Object.keys(styleObject)
  for (const property of properties) {
    const value = styleObject[property]
    if (/^\d+v[hw]$/.test(value)) {
      delete styleObject[property]
      const number_ = Number.parseFloat(value, 10)
      const vw = value.endsWith('vw')
      Object.defineProperty(styleObject, property, {
        get() {
          const { width, height } = Dimensions.get('window')
          return (number_ * (vw ? width : height)) / 100
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
    .replaceAll('min-width:', 'w>=') // 替换 min-width: 为 width>=
    .replaceAll('max-width:', 'w<=') // 替换 max-width: 为 width<=
    .replaceAll('px', '') // 去除 px 单位
    .replaceAll(' and ', ' && ') // 替换 and 为 &&
    .replaceAll(' all ', ' true ')
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
    const returnValue = styles[c]
    if (!returnValue) {
      throw new Error(
        `@tingyuan/react-native-tailwindcss: class "${c}" does not exist in generated tailwind styles.( node_modules/@tingyuan/react-native-tailwindcss/src/styles.js )`
      )
    }

    return returnValue
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
  if (styles.length === 0) {
    return twStyles
  }

  return StyleSheet.flatten([twStyles, ...styles])
}

export function useAppState(callback) {
  const currentState = AppState.currentState
  const [appState, setAppState] = useState(currentState)
  const callbackReference = useRef(callback)
  callbackReference.current = callback

  useEffect(() => {
    function onChange(newState) {
      setAppState(newState)
      callbackReference.current?.(newState)
    }

    const subscription = AppState.addEventListener('change', onChange)

    return () => {
      subscription.remove()
    }
  }, [])

  return appState
}

export function useTw() {
  const color = useColorScheme()
  useWindowDimensions()
  const colorReference = useRef(color)
  colorReference.current = color
  const [, update] = useState(false)
  useAppState(() => {
    const cc = Appearance.getColorScheme()
    if (colorReference.current !== cc) {
      update(v => !v)
    }

    colorReference.current = cc
  })
  return tw
}
