import { StyleProp, StyleSheet, TextInput, TextStyle } from "react-native";
import { PHColors } from "../constants/PHColors";

type TextBoxSettings = {
  width: number;
  height: number;
  fontSize: number;
};

type Props = {
  value: string;
  placeholder: string;
  placeholderColor?: string;
  textBoxSettings?: TextBoxSettings;
  multiline?: boolean;
  secret?: boolean;
  limitTextQuantity?: number;
  extraStyle?: StyleProp<TextStyle>;
  onChangeText: (text: string) => void;
};

const PHTextBox = (props: Props) => {
  const isMultiline = props.multiline !== undefined ? props.multiline : false;
  const isSecret = props.secret !== undefined ? props.secret : false;
  const limit =
    props.limitTextQuantity !== undefined ? props.limitTextQuantity : undefined;
  const defaultTextBoxSettings =
    props.textBoxSettings !== undefined
      ? {
          width: props.textBoxSettings.width,
          height: props.textBoxSettings.height,
          fontSize: props.textBoxSettings.fontSize,
        }
      : { width: 250, height: 50, fontSize: 16 };

  return (
    <TextInput
      style={[styles.inputStyle, props.extraStyle, defaultTextBoxSettings]}
      value={props.value}
      placeholder={props.placeholder}
      placeholderTextColor={props.placeholderColor}
      onChangeText={props.onChangeText}
      multiline={isMultiline}
      secureTextEntry={isSecret}
      maxLength={limit}
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
  },
});

export default PHTextBox;
