const moduleName = '@tingyuan/react-native-tailwindcss'

/**
 * @param {import("@babel/core")} t
 */
module.exports = function ({ types: t }) {
  return {
    visitor: {
      CallExpression(path, state) {
        const callee = path.node.callee
        // 判断函数调用是否为名为 "tw" 的函数调用
        if (t.isIdentifier(callee) && callee.name === 'tw') {
          const functionDeclaration = path.findParent(
            parentPath =>
              (t.isFunctionDeclaration(parentPath.node) ||
                t.isFunctionExpression(parentPath.node)) &&
              t.isIdentifier(parentPath.node.id)
          )
          const functionName = functionDeclaration.node.id.name
          // const { functionNameWhiteList } = state.opts
          if (
            !(/^[A-Z][a-zA-Z\d]*$/.test(functionName) || /^use[A-Z][a-zA-Z\d]*$/.test(functionName))
          ) {
            // If (
            //   Array.isArray(functionNameWhiteList) &&
            //   functionNameWhiteList.some(v => {
            //     if (typeof v === 'string') {
            //       return funcName.includes(v)
            //     }
            //     return v.test(funcName)
            //   })
            // ) {
            //   // ignore
            // } else {
            throw new Error(
              `${moduleName}: "className" and "tw()" can only be used in react component function or react hook function while "${functionName}" is neither.`
            )
            // }
          }

          if (!state.hasImported) {
            const importStatement = t.importDeclaration(
              [t.importSpecifier(t.identifier('useTw'), t.identifier('useTw'))],
              t.stringLiteral(moduleName)
            )
            const programPath = path.findParent(t.isProgram)
            programPath.unshiftContainer('body', importStatement)
            state.hasImported = true
          }

          // 向上查找符合条件的函数声明
          if (functionDeclaration) {
            const body = functionDeclaration.get('body')

            // 在函数声明的函数体第一行插入 `const tw = useTw()`
            if (t.isBlockStatement(body)) {
              if (
                body.node.body.some(statement => {
                  if (
                    statement &&
                    t.isVariableDeclaration(statement) &&
                    // Statement.kind === 'const' &&
                    statement.declarations.length > 0 &&
                    t.isIdentifier(statement.declarations[0].id, { name: 'tw' })
                  ) {
                    return true
                  }
                })
              ) {
                return
              }

              const calling = t.callExpression(t.identifier('useTw'), [])
              t.addComment(calling, 'leading', '#__PURE__')
              body.unshiftContainer(
                'body',
                t.variableDeclaration('const', [t.variableDeclarator(t.identifier('tw'), calling)])
              )
            }
          }
        }
      },
      JSXOpeningElement(path) {
        const classNameAttribute = path.node.attributes.find(
          attribute => attribute.name && attribute.name.name === 'className'
        )
        if (!classNameAttribute) {
          return
        }

        const styleAttribute = path.node.attributes.find(
          attribute => attribute.name && attribute.name.name === 'style'
        )

        if (styleAttribute) {
          // <div className="aa bb" style={{ cc: 1 }}></div>
          // 转换为 <div style={tw("aa bb", {cc: 1})}></div>
          styleAttribute.value.expression = t.callExpression(t.identifier('tw'), [
            t.isJSXExpressionContainer(classNameAttribute.value)
              ? classNameAttribute.value.expression
              : classNameAttribute.value,
            styleAttribute.value.expression,
            // T.callExpression(t.identifier('tw'), [classNameAttr.value]),
          ])
        } else {
          // <div className="aa bb"></div>
          // 转换为 <div style={tw("aa bb")}></div>
          path.node.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier('style'),
              t.jsxExpressionContainer(
                t.callExpression(t.identifier('tw'), [
                  t.isJSXExpressionContainer(classNameAttribute.value)
                    ? classNameAttribute.value.expression
                    : classNameAttribute.value,
                ])
              )
            )
          )
        }

        // 移除原始的 className 属性
        const index = path.node.attributes.indexOf(classNameAttribute)
        path.node.attributes.splice(index, 1)
      },
    },
  }
}
