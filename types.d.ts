import type { StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native'

declare global {
  function tw(classes: string, ...styles: StyleProp<ViewStyle | TextStyle | ImageStyle>[]): any // StyleProp<ViewStyle | TextStyle | ImageStyle>
}
