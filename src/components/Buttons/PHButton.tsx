import React from "react";
import {
	GestureResponderEvent,
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	ViewStyle,
} from "react-native";
import { PHColors } from "../../constants/PHColors";

type ColorSettings = {
	normal: string;
	pressed: string;
	textNormal: string;
	textPressed: string;
	border?: string;
};

type Props = {
	text: string;
	onPressed: (event: GestureResponderEvent) => void;
	customColor?: ColorSettings;
	size?: { width?: number; height?: number };
	extraStyle?: StyleProp<ViewStyle>;
};

const PHButton = (props: Props) => {
	const defaultColors: ColorSettings = {
		normal: PHColors.background,
		pressed: PHColors.border,
		textNormal: PHColors.border,
		textPressed: PHColors.background,
		border: PHColors.border,
	};

	const dynamicColors = props.customColor ?? defaultColors;
	const adaptativeSize =
		props.size !== undefined
			? {
					width: props.size.width,
					height: props.size.height,
				}
			: {};

	return (
		<Pressable
			style={({ pressed }) => [
				styles.button,
				pressed ? styles.buttonPressed : styles.button,
				{
					backgroundColor: pressed
						? dynamicColors.pressed
						: dynamicColors.normal,
					borderColor: dynamicColors.border,
				},
				adaptativeSize,
				props.extraStyle,
			]}
			onPress={props.onPressed}
		>
			{({ pressed }) => (
				<Text
					style={[
						styles.buttonText,
						pressed ? styles.buttonTextPressed : styles.buttonText,
						{
							color: pressed
								? dynamicColors.textPressed
								: dynamicColors.textNormal,
						},
					]}
				>
					{props.text}
				</Text>
			)}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	buttonText: {
		color: PHColors.text,
		fontSize: 16,
		userSelect: "none",
	},
	buttonTextPressed: {
		color: PHColors.foreground,
		fontSize: 16,
		userSelect: "none",
	},
	button: {
		paddingHorizontal: 30,
		paddingVertical: 10,
		borderWidth: 3,
		borderRadius: 20,
		borderColor: PHColors.border,
		alignItems: "center",
	},
	buttonPressed: {
		paddingHorizontal: 28,
		paddingVertical: 8,
		borderWidth: 5,
		borderRadius: 20,
		borderColor: PHColors.border,
		backgroundColor: PHColors.border,
	},
});

export default PHButton;
