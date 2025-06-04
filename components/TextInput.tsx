import React from "react";
import { TextInput as RNTextInput, StyleSheet } from "react-native";

interface TextInputProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: object;
}

const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  value,
  onChangeText,
  style,
}) => {
  return (
    <RNTextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 16,
    marginTop: 5,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 17,
    fontWeight: "500",
    letterSpacing: -0.68,
    backgroundColor: "#f5f5f5",
    width: "100%",
  },
});

export default TextInput;
