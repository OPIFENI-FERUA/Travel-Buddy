// components/ProfileField.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

import { ProfileFieldProps } from "@/types/type";

const ProfileField = ({
  label,
  icon,
  value,
  onChangeText,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  placeholder,
  editable = false,
  onPress,
  ...props
}: ProfileFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.7}
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          !editable && styles.nonEditableContainer
        ]}
      >
        {icon && 
          <Image source={icon} style={[styles.icon, iconStyle]} />
        }
<TextInput
  style={[styles.input, inputStyle, !editable && styles.nonEditableInput]}
  value={value}
  onChangeText={onChangeText}
  placeholder={!isFocused ? placeholder : ""}
  secureTextEntry={secureTextEntry}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  editable={editable}
  {...props}
/>

      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontFamily: "Jakarta-medium",
    marginBottom: 8,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f5f5f5",
    paddingHorizontal: 12,
  },
  inputContainerFocused: {
    borderColor: "#007bff",
  },
  nonEditableContainer: {
    backgroundColor: "#f0f0f0",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
    color: "black"
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "JakartaSemiBold",
    paddingVertical: 12,
    color: "#333",
  },
  nonEditableInput: {
    color: "#666",
  },
});

export default ProfileField;