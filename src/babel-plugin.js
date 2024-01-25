module.exports = function ({ types: t }) {
  return {
    visitor: {
      Program(path, state) {
        let hasFooImport = false
        // console.log('Current file:', state.filename)
        if (state.filename.includes('/node_modules/')) {
          return
        }
        if (state.inserted) {
          return
        }
        const name = '@tingyuan/react-native-tailwindcss'
        // 检查已有的 import 语句中是否已经存在 import "foo"
        path.traverse({
          ImportDeclaration(innerPath) {
            if (innerPath.node.source.value === name) {
              hasFooImport = true
            }
          },
        })
        if (!hasFooImport) {
          const importFoo = t.importDeclaration([], t.stringLiteral(name))
          path.node.body.unshift(importFoo)
          state.inserted = true
        }
      },
      JSXOpeningElement(path) {
        const classNameAttr = path.node.attributes.find(
          attr => attr.name && attr.name.name === 'className'
        )
        if (!classNameAttr) {
          return
        }

        const styleAttr = path.node.attributes.find(attr => attr.name && attr.name.name === 'style')

        if (styleAttr) {
          // <div className="aa bb" style={{ cc: 1 }}></div>
          // 转换为 <div style={foo({cc: 1}, transformClassName("aa bb"))}></div>
          styleAttr.value.expression = t.callExpression(t.identifier('tw'), [
            t.isJSXExpressionContainer(classNameAttr.value)
              ? classNameAttr.value.expression
              : classNameAttr.value,
            styleAttr.value.expression,
            // t.callExpression(t.identifier('transformClassName'), [classNameAttr.value]),
          ])
        } else {
          // <div className="aa bb"></div>
          // 转换为 <div style={transformClassName("aa bb")}></div>
          path.node.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier('style'),
              t.jsxExpressionContainer(
                t.callExpression(t.identifier('tw'), [
                  t.isJSXExpressionContainer(classNameAttr.value)
                    ? classNameAttr.value.expression
                    : classNameAttr.value,
                ])
              )
            )
          )
        }

        // 移除原始的 className 属性
        const index = path.node.attributes.indexOf(classNameAttr)
        path.node.attributes.splice(index, 1)
      },
    },
  }
}
