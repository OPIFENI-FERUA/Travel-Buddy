import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import HeaderSection from "@/components/HeaderSection";
import ReceiverDetailsForm from "@/components/ReceiverDetailsForm";

const HOME: React.FC = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <HeaderSection />
        <ReceiverDetailsForm />
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
  },
});

export default HOME;
