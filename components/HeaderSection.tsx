import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { icons } from "@/constants";

const HeaderSection: React.FC = () => {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <Image 
          source={icons.backArrow} 
          resizeMode="contain" 
          style={styles.backIcon} 
        />
      </TouchableOpacity>
      <Text style={styles.title}>Courier Service</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomRightRadius: 32,
    borderBottomLeftRadius: 32,
    backgroundColor: "#3737ff",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 100,
    position: "absolute",
    left: 20,
    top: 56,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: "#3737ff",
  },
  title: {
    color: "#fff",
    fontFamily: "Jakarta-Bold",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.5,
  },
});

export default HeaderSection;
