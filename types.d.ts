import type { StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native'

declare global {
  function tw(classes: string, ...styles: StyleProp<ViewStyle | TextStyle | ImageStyle>[]): any // StyleProp<ViewStyle | TextStyle | ImageStyle>
}

// copy from nativewind: https://github.com/marklawlor/nativewind/blob/main/packages/react-native-css-interop/types.d.ts
declare module 'react-native' {
  interface FlatListProps<ItemT> extends VirtualizedListProps<ItemT> {
    className?: string
    tw?: string
  }

  interface ImagePropsBase {
    className?: string
    tw?: string
  }

  interface ViewProps {
    className?: string
    tw?: string
  }

  interface TextProps {
    className?: string
    tw?: string
  }

  interface SwitchProps {
    className?: string
    tw?: string
  }

  interface InputAccessoryViewProps {
    className?: string
    tw?: string
  }

  interface TouchableWithoutFeedbackProps {
    className?: string
    tw?: string
  }
}
