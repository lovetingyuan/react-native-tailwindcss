const assert = require('node:assert/strict');
const test = require('node:test');
const babel = require('@babel/core');

const code = `
import { createTheme } from '@rneui/themed'
// import { useTw } from '@tingyuan/react-native-tailwindcss'
import React from 'react'

import { colors } from '@/constants/colors.tw'

import { useAppState } from './useAppState'
import useIsDark from './useIsDark'

export default function useRNETheme() {
  // const tw = useTw()
  const [primary, secondary] = [
    tw(colors.primary.text).color,
    tw(colors.secondary.text).color,
  ]
  // console.log(primary, secondary)
  const isDark = useIsDark()
  const getRNETheme = React.useCallback(() => {
    return createTheme({
      lightColors: {
        primary,
        secondary,
      },
      darkColors: {
        primary,
        secondary,
      },
      mode: isDark ? 'dark' : 'light',
    })
  }, [primary, secondary, isDark])
  const [rneTheme, setRNETheme] = React.useState(getRNETheme)
  React.useEffect(() => {
    setRNETheme(getRNETheme())
  }, [getRNETheme])

  useAppState(() => {
    setRNETheme(getRNETheme())
  })
  return rneTheme
}

`;
const result = babel.transformSync(code, {
	plugins: [require('../src/babel-plugin')],
	presets: ['@babel/preset-react'],
});

// Console.log(result.code)
// process.exit(0)

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
		},
	);
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
  `.trim(),
	);
});

test('base-no-inject', t => {
	const result = babel.transformSync(
		`
function loading() {
  return (
    <View></View>
  )
}
`.trim(),
		{
			plugins: [require('../src/babel-plugin')],
			presets: ['@babel/preset-react'],
		},
	);
	assert.equal(
		result.code,
		`
function loading() {
  return /*#__PURE__*/React.createElement(View, null);
}
  `.trim(),
	);
});

test('base-inject-inhook', t => {
	const result = babel.transformSync(
		`
function useFoo() {
  return (
    <View style={tw('aaa')}></View>
  )
}
`.trim(),
		{
			plugins: [require('../src/babel-plugin')],
			presets: ['@babel/preset-react'],
		},
	);
	assert.equal(
		result.code,
		`
import { useTw } from "@tingyuan/react-native-tailwindcss";
function useFoo() {
  const tw = /*#__PURE__*/useTw();
  return /*#__PURE__*/React.createElement(View, {
    style: tw('aaa')
  });
}
  `.trim(),
	);
});

test('base-invalid-usage', t => {
	assert.throws(() => {
		babel.transformSync(
			`
  function foo() {
    return (
      <View style={tw('aaa')}></View>
    )
  }
  `.trim(),
			{
				plugins: [require('../src/babel-plugin')],
				presets: ['@babel/preset-react'],
			},
		);
	}, '"className" and "tw()" can only be used in react component function or react hook function while "foo" is neither.');
});

test('base-invalid-usage-classname', t => {
	assert.throws(() => {
		babel.transformSync(
			`
  function foo() {
    return (
      <View className="bar"></View>
    )
  }
  `.trim(),
			{
				plugins: [require('../src/babel-plugin')],
				presets: ['@babel/preset-react'],
			},
		);
	}, '"className" and "tw()" can only be used in react component function or react hook function while "foo" is neither.');
});

test('base-classname-hook', t => {
	const result = babel.transformSync(
		`
  function useFoo() {
    return (
      <View className="bar"></View>
    )
  }
  `.trim(),
		{
			plugins: [require('../src/babel-plugin')],
			presets: ['@babel/preset-react'],
		},
	);
	assert.equal(
		result.code,
		`
import { useTw } from "@tingyuan/react-native-tailwindcss";
function useFoo() {
  const tw = /*#__PURE__*/useTw();
  return /*#__PURE__*/React.createElement(View, {
    style: tw("bar")
  });
}
  `.trim(),
	);
});
