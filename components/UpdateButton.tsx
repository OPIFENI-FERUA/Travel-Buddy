import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

interface UpdateButtonProps {
  onPress?: () => void;
}

const UpdateButton: React.FC<UpdateButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Update</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    marginTop: 42,
    marginLeft: 15,
    width: "100%",
    maxWidth: 367,
    paddingLeft: 70,
    paddingRight: 70,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#3737ff",
  },
  buttonText: {
    fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 20,
    color: "rgba(255, 255, 255, 1)",
    textAlign: "center",
    letterSpacing: -0.8,
    fontWeight: "600",
  },
});

export default UpdateButton;
