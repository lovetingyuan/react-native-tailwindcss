// color: rgb(52 211 153 / 1);
// -->
// color: rgb(52, 211, 153, 1);
const transform = require('css-to-react-native')

const preProcessValue = (prop, value) => {
  if (value.startsWith('rgb(')) {
    const val = value.slice(4, -1)
    const [rgb, a] = val.split('/')
    const [r, g, b] = rgb.split(/ |,|, /)
    if (a) {
      value = `rgba(${r},${g},${b},${a})`
    } else {
      value = `rgb(${r},${g},${b})`
    }
  }
  if (value.endsWith('rem')) {
    value = value.replace(/(\d*\.?\d+)rem/g, (match, m1) => parseFloat(m1, 10) * 16 + 'px')
  }

  if (prop === 'transform') {
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
  opts = {
    cssObject: {},
    breakPoints: {},
    ignoreClasses: [],
  }
) => {
  // Work with options here

  return {
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
        // decl.parent.parent.type === 'root' &&
        decl.parent.selector.startsWith('.')
      ) {
        const { selector } = decl.parent
        let { prop, value } = decl
        if (opts.ignoreClasses?.includes(selector)) {
          return
        }
        // console.log('DeclarationExit', decl.parent.selector, prop, value)

        const result = transform.default([[prop, preProcessValue(prop, value, selector)]])

        const cls = selector.slice(1).replace(/\\/g, '') //.split('[break-point="')
        if (!opts.cssObject[cls]) {
          opts.cssObject[cls] = result
        } else {
          Object.assign(opts.cssObject[cls], result)
        }
        if (/^(sm|xs|md|lg|\d*xl):/.test(cls)) {
          const atRule = decl.parent.parent
          if (atRule && atRule.type === 'atrule' && atRule.name === 'media') {
            const list = cls.split(':')
            list.pop()
            const bp = list.join(':')
            if (opts.breakPoints[bp] && opts.breakPoints[bp] !== atRule.params) {
              throw new Error(
                `break point ${bp} is inconsistent: ${opts.breakPoints[bp]} and ${atRule.params}`
              )
            }
            opts.breakPoints[bp] = atRule.params
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
  }
}

module.exports.postcss = true
