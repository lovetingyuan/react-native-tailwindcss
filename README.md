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

3. start tailwindcss watch task for development.

   `npx react-native-tailwindcss-start`

### example

```jsx
function App(props: { textColor: string }) {
  const renderItem = ({ item }) => <Text>{item.title}</Text>
  return (
    <View className="flex-1 flex-row h-full">
      <Text className="font-bold text-green-500 text-lg" style={{ color: props.textColor }}>
        Hello Tailwindcss
      </Text>
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

jsx attribute `className` will be transformed to `style` and `tw('')` will be transformed to style object.

### TypeScript support

To support infer global `tw` helper function type, you can:

add three slash directive in a `.d.ts` file:

`/// <reference types="@tingyuan/react-native-tailwindcss/types" />`

or import the types in a `.d.ts` file:

`import "@tingyuan/react-native-tailwindcss/types"`

or add the types in your `tsconfig.json`:

`{ "types": [ "@tingyuan/react-native-tailwindcss/types"] }`

### eslint

```js
{
  globals: { tw: 'readonly' },
}
```
