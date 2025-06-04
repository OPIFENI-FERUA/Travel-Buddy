import { useOAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Alert, Image, Text, View, StyleSheet } from "react-native";

import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { googleOAuth } from "@/lib/auth";
import React from "react";

const OAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleGoogleSignIn = async () => {
    const result = await googleOAuth(startOAuthFlow);

    if (result.code === "session_exists") {
      Alert.alert("Success", "Session exists. Redirecting to home screen.");
      router.replace("/(root)/(tabs)/home");
    }

    Alert.alert(result.success ? "Success" : "Error", result.message);
  };

  return (
    <View>
      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.orText}>Or Continue With</Text>
        <View style={styles.separator} />
      </View>

      <CustomButton
        title="Log In with Google"
        style={styles.button}
        IconLeft={() => (
          <Image source={icons.google} resizeMode="contain" style={styles.icon} />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  separatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#000",
    opacity: 0.5
  },
  orText: {
    fontSize: 18,
    color: "#000",
    opacity: 0.5
  },
  button: {
    marginTop: 20,
    marginLeft: 20,
    width: "90%",
    shadowColor: "transparent",
    backgroundColor: "#EBEBEB"
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 8,
  },
});

export default OAuth;