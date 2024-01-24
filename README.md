# react-native-tailwindcss

Use [tailwindcss](https://tailwindcss.com/) in react-native project

### install

`npm install @tingyuan/react-native-tailwindcss --save-dev`

### usage

1. add babel plugin to babel config

```js
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: ['@tingyuan/react-native-tailwindcss/babel'],
  }
}
```

2. import runtime module at the very begin position

```js
import '@tingyuan/react-native-tailwindcss'
```

3. start tailwindcss watch service for development.

`npx react-native-tailwindcss-start`
