import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from "react-native";

import { ButtonProps } from "@/types/type";

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]): ViewStyle => {
  switch (variant) {
    case "secondary":
      return { backgroundColor: "#6b7280" }; // gray-500
    case "danger":
      return { backgroundColor: "#ef4444" }; // red-500
    case "success":
      return { backgroundColor: "#22c55e" }; // green-500
    case "outline":
      return {
        backgroundColor: "transparent",
        borderColor: "#d4d4d4", // neutral-300
        borderWidth: 0.5,
      };
    default:
      return { backgroundColor: "#3737ff" }; // primary
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]): TextStyle => {
  switch (variant) {
    case "primary":
      return { color: "#000000" }; // black
    case "secondary":
      return { color: "#f3f4f6" }; // gray-100
    case "danger":
      return { color: "#fee2e2" }; // red-100
    case "success":
      return { color: "#dcfce7" }; // green-100
    default:
      return { color: "#ffffff" }; // white
  }
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  style,
  loading = false,
  disabled = false,
  ...props
}: ButtonProps) => {
  const buttonStyle = {
    ...styles.button,
    ...getBgVariantStyle(bgVariant),
    ...(style as ViewStyle), // Allow additional styles to be passed via `style` prop
    ...(disabled && styles.disabledButton),
  };

  const textStyle = {
    ...styles.text,
    ...getTextVariantStyle(textVariant),
    ...(disabled && styles.disabledText),
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={buttonStyle}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {IconLeft && <IconLeft />}
          <Text style={textStyle}>{title}</Text>
          {IconRight && <IconRight />}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 999, // rounded-full
    padding: 12, // p-3
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#a3a3a3", // neutral-400
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  disabledButton: {
    opacity: 0.7,
    backgroundColor: "#a0a0ff",
  },
  text: {
    fontSize: 18, // text-lg
    fontWeight: "bold",
  },
  disabledText: {
    color: "#e0e0e0",
  },
});

export default CustomButton;