import * as React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from "react-native";

interface ActionButtonProps {
  iconUrl: ImageSourcePropType | string;
  label: string;
  onPress?: () => void;
  iconAspectRatio?: number;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  iconUrl,
  label,
  onPress,
  iconAspectRatio = 4,
}) => {
  // Determine if the iconUrl is a string (remote URL) or a local asset
  const imageSource = typeof iconUrl === 'string' 
    ? { uri: iconUrl } 
    : iconUrl;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.container}>
        <Image
          source={imageSource}
          style={[styles.icon, { aspectRatio: iconAspectRatio }]}
        />
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 34,
    borderColor: "rgba(0, 0, 0, 0.38)",
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    paddingLeft: 35,
    backgroundColor: "white",
    paddingRight: 35,
    paddingTop: 47,
    paddingBottom: 47,
    flexDirection: "column",
    alignItems: "center",
    width: 153,
    height: 153,
  },
  icon: {
    width: 48,
    height: 48,
    alignSelf: "center",
    color: "#3737ff",
  },
  labelContainer: {
    marginTop: 11,
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 1)",
    letterSpacing: -0.64,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default ActionButton;
