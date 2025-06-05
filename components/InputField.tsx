import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions, StyleProp, ViewStyle } from "react-native";

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<ViewStyle>;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  maxLength?: number;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  style,
  autoCapitalize,
  keyboardType,
  maxLength,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
      
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType={keyboardType as KeyboardTypeOptions}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Jakarta-Semibold",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 12,
  },
  input: {
    borderRadius: 18,
    paddingHorizontal: 17,
    paddingVertical: 12,
    fontSize: 17,
    fontWeight: "500",
    letterSpacing: -0.68,
    backgroundColor: "#f5f5f5",
    width: "100%",
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputFocused: {
    borderColor: "#3737ff",
    backgroundColor: "#fff",
  },
});

export default InputField;
