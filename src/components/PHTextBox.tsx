import {
	DimensionValue,
	Platform,
	StyleProp,
	StyleSheet,
	TextInput,
	TextInputProps,
	TextStyle,
} from "react-native";
import { PHColors } from "../constants/PHColors";

type TextBoxSettings = {
	width?: DimensionValue;
	height?: DimensionValue;
	fontSize?: number;
};

type Props = {
	value: string;
	placeholder: string;
	placeholderColor?: string;
	textBoxSettings?: TextBoxSettings;
	multiline?: boolean;
	secret?: boolean;
	limitTextQuantity?: number;
	keyboardType?: "default" | "email-address" | "numeric";
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	autoCorrect?: boolean;
	textContentType?: TextInputProps["textContentType"];
	autoComplete?: TextInputProps["autoComplete"];
	extraStyle?: StyleProp<TextStyle>;
	onChangeText: (text: string) => void;
};

const PHTextBox = (props: Props) => {
	const isMultiline = props.multiline !== undefined ? props.multiline : false;
	const isSecret = props.secret !== undefined ? props.secret : false;
	const limit = props.limitTextQuantity;
	const defaultTextBoxSettings: TextStyle = {
		width: props.textBoxSettings?.width ?? 250,
		height: props.textBoxSettings?.height ?? 50,
		fontSize: props.textBoxSettings?.fontSize ?? 16,
	};

	return (
		<TextInput
			style={[
				styles.inputStyle,
				defaultTextBoxSettings,
				props.extraStyle,
			]}
			pointerEvents="auto"
			value={props.value}
			placeholder={props.placeholder}
			placeholderTextColor={props.placeholderColor}
			onChangeText={props.onChangeText}
			multiline={isMultiline}
			secureTextEntry={isSecret}
			maxLength={limit}
			keyboardType={props.keyboardType || "default"}
			autoCapitalize={props.autoCapitalize || "none"}
			autoCorrect={props.autoCorrect ?? false}
			textContentType={props.textContentType}
			autoComplete={props.autoComplete}
		/>
	);
};

const styles = StyleSheet.create({
	inputStyle: {
		paddingVertical: 8,
		paddingHorizontal: 10,

		color: PHColors.text,

		borderWidth: 2,
		borderRadius: 15,
		borderColor: PHColors.border,

		...Platform.select({
			web: {
				outlineStyle: "none" as any,
				cursor: "text" as any,
			},
		}),
	},
});

export default PHTextBox;
