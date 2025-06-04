import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants";
import React from "react";

const Chat = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Chat</Text>
        <View style={styles.centerContent}>
          <Image
            source={images.message}
            alt="message"
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>No Messages Yet</Text>
          <Text style={styles.subtitle}>
            Start a conversation with your friends and family
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "JakartaBold", // Make sure this font is properly loaded
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 160,
  },
  title: {
    fontSize: 24,
    fontFamily: "JakartaBold",
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 28,
  },
});

export default Chat;
