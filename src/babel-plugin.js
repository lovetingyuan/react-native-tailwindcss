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
          let functionDeclaration = path.findParent(
            parentPath =>
              (t.isFunctionDeclaration(parentPath.node) ||
                t.isFunctionExpression(parentPath.node)) &&
              t.isIdentifier(parentPath.node.id) &&
              /^[A-Z][a-zA-Z0-9]*$/.test(parentPath.node.id.name)
          )
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
              const firstStatement = body.node.body[0]
              if (
                firstStatement &&
                t.isVariableDeclaration(firstStatement) &&
                firstStatement.kind === 'const' &&
                firstStatement.declarations.length > 0 &&
                t.isIdentifier(firstStatement.declarations[0].id, { name: 'tw' })
              ) {
                return
              }

              body.unshiftContainer(
                'body',
                t.variableDeclaration('const', [
                  t.variableDeclarator(
                    t.identifier('tw'),
                    t.callExpression(t.identifier('useTw'), [])
                  ),
                ])
              )
            }
          }
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
          // 转换为 <div style={tw("aa bb", {cc: 1})}></div>
          styleAttr.value.expression = t.callExpression(t.identifier('tw'), [
            t.isJSXExpressionContainer(classNameAttr.value)
              ? classNameAttr.value.expression
              : classNameAttr.value,
            styleAttr.value.expression,
            // t.callExpression(t.identifier('tw'), [classNameAttr.value]),
          ])
        } else {
          // <div className="aa bb"></div>
          // 转换为 <div style={tw("aa bb")}></div>
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
