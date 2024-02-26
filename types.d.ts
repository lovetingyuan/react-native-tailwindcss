import type {
	StyleProp, ViewStyle, TextStyle, ImageStyle,
} from 'react-native';

declare global {
	function tw(classes: string, ...styles: Array<StyleProp<ViewStyle | TextStyle | ImageStyle>>): any; // StyleProp<ViewStyle | TextStyle | ImageStyle>
}

// Copy from nativewind: https://github.com/marklawlor/nativewind/blob/main/packages/react-native-css-interop/types.d.ts
declare module 'react-native' {
	type FlatListProperties<ItemT> = {
		className?: string;
		tw?: string;
	} & VirtualizedListProps<ItemT>;

	type ImagePropertiesBase = {
		className?: string;
		tw?: string;
	};

	type ViewProperties = {
		className?: string;
		tw?: string;
	};

	type TextProperties = {
		className?: string;
		tw?: string;
	};

	type SwitchProperties = {
		className?: string;
		tw?: string;
	};

	type InputAccessoryViewProperties = {
		className?: string;
		tw?: string;
	};

	type TouchableWithoutFeedbackProperties = {
		className?: string;
		tw?: string;
	};
}
