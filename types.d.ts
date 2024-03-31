import type { StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native'

declare global {
  function tw(classes: string, ...styles: Array<StyleProp<ViewStyle | TextStyle | ImageStyle>>): any // StyleProp<ViewStyle | TextStyle | ImageStyle>
}

// Copy from nativewind: https://github.com/marklawlor/nativewind/blob/main/packages/react-native-css-interop/types.d.ts
import {
  ScrollViewProps,
  ScrollViewPropsAndroid,
  ScrollViewPropsIOS,
  Touchable,
  VirtualizedListProps,
} from 'react-native'

declare module '@react-native/virtualized-lists' {
  export interface VirtualizedListWithoutRenderItemProps<ItemT> extends ScrollViewProps {
    ListFooterComponentClassName?: string
    ListHeaderComponentClassName?: string
  }
}

declare module 'react-native' {
  interface ScrollViewProps
    extends ViewProps,
      ScrollViewPropsIOS,
      ScrollViewPropsAndroid,
      Touchable {
    contentContainerClassName?: string
    indicatorClassName?: string
  }
  interface FlatListProps<ItemT> extends VirtualizedListProps<ItemT> {
    columnWrapperClassName?: string
  }
  interface ImageBackgroundProps extends ImagePropsBase {
    imageClassName?: string
  }
  interface ImagePropsBase {
    className?: string
  }
  interface ViewProps {
    className?: string
  }
  interface TextInputProps {
    placeholderClassName?: string
  }
  interface TextProps {
    className?: string
  }
  interface SwitchProps {
    className?: string
  }
  interface InputAccessoryViewProps {
    className?: string
  }
  interface TouchableWithoutFeedbackProps {
    className?: string
  }
  interface StatusBarProps {
    className?: string
  }
  interface KeyboardAvoidingViewProps extends ViewProps {
    contentContainerClassName?: string
  }
  interface ModalBaseProps {
    presentationClassName?: string
  }
}
