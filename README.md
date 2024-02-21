# react-native-tailwindcss [![npm version](https://img.shields.io/npm/v/@tingyuan/react-native-tailwindcss)](https://www.npmjs.com/package/@tingyuan/react-native-tailwindcss)

Use [tailwindcss](https://tailwindcss.com/) in react-native project

### install

`npm install @tingyuan/react-native-tailwindcss --save-dev`

### usage

1. Run `npx tailwindcss init` if `tailwind.config.js` does not exist. (see [installation](https://tailwindcss.com/docs/installation)).

2. Add the babel plugin to `babel.config.js`.

   ```js
   module.exports = function (api) {
     api.cache(true)
     return {
       presets: ['babel-preset-expo'],
       plugins: ['@tingyuan/react-native-tailwindcss/babel'],
     }
   }
   ```

3. Start tailwindcss watch task.

for development, run:

```bash
npx react-native-tailwindcss-start
```

for build, run this before the building app command:

```bash
npx react-native-tailwindcss-build
```

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

To support infer global `tw` helper function type and `className` jsx attribute, you can:

add three slash directive in a `.d.ts` file:

`/// <reference types="@tingyuan/react-native-tailwindcss/types" />`

or import the types in a `.d.ts` file:

`import "@tingyuan/react-native-tailwindcss/types"`

or add the types in your `tsconfig.json`:

`{ "types": [ "@tingyuan/react-native-tailwindcss/types"] }`

### Tailwind CSS IntelliSense

support `tw()` code hints and completion

```js
"tailwindCSS.experimental.classRegex": [
  [
    "tw\\(([^)]*)\\)",
    "[\"'`]([^\"'`]*).*?[\"'`]"
  ],
]
```

### Eslint

```js
{
  globals: { tw: 'readonly' },
}
```

### Caveats

If you encounter any problem, please try to restart your app without cache:

* Expo `npx expo start --clear`
* React Native CLI `npx react-native start --reset-cache`

The babel plugin will automatically inject `const tw = useTw()` in each react component function.

`useTw` is a hook callee, so using `className` or `tw()` must be in react component function.

When the function name is "UpperCamelCase" style and has jsx statement, the function self will be treated as a react component function.

So when you encounter error like `Rendered fewer hooks than expected` or `Property 'tw' doesn't exist`, you need to obey the limitation mentioned above.

If you see error like `class xxx does not exist in generated tailwind styles`, please make sure to run command mentioned above in No.3 (Start tailwindcss watch task for development.)

### Limitation ⚠

I have to say, this project is not a comprehensive solution to use all features of tailwindcss in react-native(In fact, a considerable portion of the tailwindcss functionality is inherently exclusive to the web).

But it will cover the most useful features of tailwindcss, including most of utilities classes and some prefix modifiers such as dark mode, responsive break point, vw/vh unit, viewport orientation.

If you seek more enhanced and comprehensive solution, you can try [NativeWind](https://www.nativewind.dev/).
