// Color: rgb(52 211 153 / 1);
// -->
// color: rgb(52, 211, 153, 1);
const transform = require('css-to-react-native')

const preProcessValue = (property, value) => {
  if (value.startsWith('rgb(')) {
    const value_ = value.slice(4, -1)
    const [rgb, a] = value_.split('/')
    const [r, g, b] = rgb.split(/ |,|, /)
    value = a ? `rgba(${r},${g},${b},${a})` : `rgb(${r},${g},${b})`
  }

  if (value.endsWith('rem')) {
    value = value.replaceAll(
      /(\d*\.?\d+)rem/g,
      (match, m1) => Number.parseFloat(m1, 10) * 16 + 'px'
    )
  }

  if (property === 'transform') {
    value = value
      .replace('rotate(0)', 'rotate(0deg)')
      .replace('skew(0)', 'skew(0deg)')
      .replace('skewX(0)', 'skewX(0deg)')
      .replace('skewY(0)', 'skewY(0deg)')
  }

  return value
}

/**
 * @type {import('postcss').PluginCreator}
 * @param {{ cssObject: Record<string, any> }} opts options
 */
module.exports = (
  options = {
    cssObject: {},
    breakPoints: {},
    ignoreClasses: [],
  }
) =>
  // Work with options here

  ({
    postcssPlugin: 'postcss-css-to-tailwind',
    // AtRule(atRule) {
    //   return
    //   if (atRule.name === 'media') {
    //     const mediaQuery = atRule.params
    //     const rules = []

    //     atRule.walkRules(rule => {
    //       rules.push(rule)
    //     })

    //     rules.forEach(rule => {
    //       if (rule.selector.startsWith('.')) {
    //         const responsiveSelector = `${rule.selector}[break-point="${mediaQuery}"]`
    //         const clonedRule = rule.clone({ selector: responsiveSelector })
    //         atRule.parent.append(clonedRule)
    //       }
    //     })

    //     atRule.remove()
    //   }
    // },
    DeclarationExit(decl) {
      // 检查属性声明是否在顶层的class选择器规则中
      if (
        decl.parent.type === 'rule' &&
        // Decl.parent.parent.type === 'root' &&
        decl.parent.selector.startsWith('.')
      ) {
        const { selector, nodes } = decl.parent
        if (options.ignoreClasses?.includes(selector)) {
          return
        }
        const { prop, value } = decl
        if (prop.startsWith('--')) {
          return
        }
        const firstDecl = nodes.find(node => {
          return node.prop === prop
        })

        if (firstDecl.value !== value) {
          decl.remove()
          return
        }

        // Console.log('DeclarationExit', decl.parent.selector, prop, value)

        let result = null
        try {
          result = transform.default([[prop, preProcessValue(prop, value, selector)]])
        } catch (err) {
          console.error('@tingyuan/react-native-tailwindcss css-to-react-native error:')
          throw err
        }

        const cls = selector.slice(1).replaceAll('\\', '') // .split('[break-point="')
        if (options.cssObject[cls]) {
          Object.assign(options.cssObject[cls], result)
        } else {
          options.cssObject[cls] = result
        }

        if (/^(sm|xs|md|lg|\d*xl):/.test(cls)) {
          const atRule = decl.parent.parent
          if (atRule && atRule.type === 'atrule' && atRule.name === 'media') {
            const list = cls.split(':')
            list.pop()
            const bp = list.join(':')
            if (options.breakPoints[bp] && options.breakPoints[bp] !== atRule.params) {
              throw new Error(
                `break point ${bp} is inconsistent: ${options.breakPoints[bp]} and ${atRule.params}`
              )
            }

            options.breakPoints[bp] = atRule.params
          }
        }
      }
    },
    /*
    Declaration: {
      color: (decl, postcss) {
        // The fastest way find Declaration node if you know property name
      }
    }
    */
  })

module.exports.postcss = true
