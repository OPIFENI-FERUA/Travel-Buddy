import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import HeaderSection from "@/components/HeaderSection";
import SenderDetailsForm from "@/components/SenderDetailsForm";

const HOME: React.FC = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <HeaderSection />
        <SenderDetailsForm />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderStyle: "solid",
    borderWidth: 1,
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 480,
    width: "100%",
    overflow: "hidden",
    fontFamily: "Jakarta-Bold",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: -0.8,
    backgroundColor: "#fff",
    padding: 0,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default HOME;
