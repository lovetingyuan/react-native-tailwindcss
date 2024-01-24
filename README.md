# react-native-tailwindcss [![npm version](https://img.shields.io/npm/v/@tingyuan/react-native-tailwindcss)](https://www.npmjs.com/package/@tingyuan/react-native-tailwindcss)

Use [tailwindcss](https://tailwindcss.com/) in react-native project

### install

`npm install @tingyuan/react-native-tailwindcss --save-dev`

### usage

1. run `npx tailwindcss init` and follow tailwindcss [installation](https://tailwindcss.com/docs/installation).

2. add the babel plugin to `babel.config.js`

```js
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: ['@tingyuan/react-native-tailwindcss/babel'],
  }
}
```

3. import the runtime module at the very beginning code position

```js
import '@tingyuan/react-native-tailwindcss'
```

4. start tailwindcss watch task for development.

`npx react-native-tailwindcss-start`

### example

```jsx
function App() {
  const renderItem = ({ item }) => <Text>{item.title}</Text>
  return (
    <View className="flex-1 flex-row">
      <Text className="font-bold text-green-500 text-lg">hello tailwindcss</Text>
      <FlashList
        data={DATA}
        renderItem={renderItem}
        estimatedItemSize={200}
        contentContainerStyle={tw('px-3 bg-slate-500')}
      />
    </View>
  )
}
```

jsx `className` will be transformed to `style` and `tw('')` will be transformed to style object.
