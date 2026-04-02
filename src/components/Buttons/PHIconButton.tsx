import { PHColors } from "@/src/constants/PHColors";
import { IconDefinition, IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import {
	GestureResponderEvent,
	Pressable,
	StyleProp,
	StyleSheet,
	ViewStyle,
} from "react-native";

type ColorSettings = {
	normal: string;
	pressed: string;
	iconNormal: string;
	iconPressed: string;
	border?: string;
};

type Props = {
	icon: IconDefinition;
	onPressed: (event: GestureResponderEvent) => void;
	customColor?: ColorSettings;
	floating?: boolean;
	roundness?: number;
	iconSize?: number;
	rotate?: number;
	style?: StyleProp<ViewStyle>;
};

const PHIconButton = (props: Props) => {
	const defaultColors: ColorSettings = {
		normal: PHColors.background,
		pressed: PHColors.border,
		iconNormal: "white",
		iconPressed: PHColors.foreground,
		border: PHColors.border,
	};

	const dynamicColors = props.customColor ?? defaultColors;
	const dynamicRoundness =
		props.roundness !== undefined ? { borderRadius: props.roundness } : {};
	const dynamicIconSize = props.iconSize !== undefined ? props.iconSize : 40;
	const dynamicRotation = props.rotate !== undefined ? props.rotate : 0;

	return (
		<Pressable
			style={({ pressed }) => [
				styles.button,
				props.floating
					? pressed
						? styles.buttonFloatingPressed
						: styles.buttonFloating
					: pressed
						? styles.buttonPressed
						: styles.button,
				{
					backgroundColor: pressed
						? dynamicColors.pressed
						: dynamicColors.normal,
					borderColor: dynamicColors.border,
					borderRadius: props.roundness ?? 20,
				},
				dynamicRoundness,
				props.style,
			]}
			onPress={props.onPressed}
		>
			{({ pressed }) => (
				<FontAwesomeIcon
					icon={props.icon as IconProp}
					color={
						pressed
							? dynamicColors.iconPressed
							: dynamicColors.iconNormal
					}
					size={dynamicIconSize}
					transform={{ rotate: dynamicRotation }}
					style={{ userSelect: "none" }}
				/>
			)}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	button: {
		padding: 10,
		borderWidth: 3,
		borderRadius: 20,
		borderColor: PHColors.border,
		backgroundColor: PHColors.background,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonPressed: {
		padding: 8,
		borderWidth: 5,
		borderRadius: 20,
		borderColor: PHColors.border,
		backgroundColor: "white",
	},
	buttonFloating: {
		padding: 10,
		borderWidth: 3,
		borderRadius: 20,
		borderColor: PHColors.border,
		backgroundColor: PHColors.background,
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 60,
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		zIndex: 999,
	},
	buttonFloatingPressed: {
		padding: 8,
		borderWidth: 5,
		borderRadius: 20,
		borderColor: PHColors.border,
		backgroundColor: "white",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 60,
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		zIndex: 999,
	},
});

export default PHIconButton;
