import { icons } from "@/constants";
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

interface ProceedButtonProps {
  onPress: () => void;

  
}

const ProceedButton: React.FC<ProceedButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress}
      activeOpacity={0.8}
      
    >
      <View style={styles.buttonContent}>
   
        <Text style={styles.buttonText}>Proceed</Text>
      
        <View style={styles.arrowContainer}>
          <Image
            source={icons.frontArrow}
            style={styles.arrowIcon}
            resizeMode="contain"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 1000,
    marginTop: 46,
    backgroundColor: "#3737ff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Jakarta-Bold",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  arrowContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    color: "#3737ff",
  },
});

export default ProceedButton;
