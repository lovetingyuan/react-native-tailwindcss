const babel = require('@babel/core')
const assert = require('node:assert/strict')
const test = require('node:test')

test('base-1', t => {
  const result = babel.transformSync(
    `
function Loading() {
  return (
    <View className="absolute w-full h-full justify-center items-center">
    </View>
  )
}
`.trim(),
    {
      plugins: [require('../src/babel-plugin')],
      presets: ['@babel/preset-react'],
    }
  )
  assert.equal(
    result.code,
    `
import { useTw } from "@tingyuan/react-native-tailwindcss";
function Loading() {
  const tw = /*#__PURE__*/useTw();
  return /*#__PURE__*/React.createElement(View, {
    style: tw("absolute w-full h-full justify-center items-center")
  });
}
  `.trim()
  )
})

test('base-no-inject', t => {
  const result = babel.transformSync(
    `
function loading() {
  return (
    <View className="absolute w-full h-full justify-center items-center">
    </View>
  )
}
`.trim(),
    {
      plugins: [require('../src/babel-plugin')],
      presets: ['@babel/preset-react'],
    }
  )
  assert.equal(
    result.code,
    `
import { useTw } from "@tingyuan/react-native-tailwindcss";
function loading() {
  return /*#__PURE__*/React.createElement(View, {
    style: tw("absolute w-full h-full justify-center items-center")
  });
}
  `.trim()
  )
})
