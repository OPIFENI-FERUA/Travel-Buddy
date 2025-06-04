import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { 
  Alert, 
  Image, 
  ScrollView, 
  Text, 
  View, 
  StyleSheet 
} from "react-native";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }, [isLoaded, form.email, form.password]);

  return (
        <LinearGradient 
        colors={['#3737ff', '#ffffff']} 
        style={styles.container1}
      >
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Text style={styles.title}>Welcome Back to  Buddy </Text>
          <Text style={styles.titles}>Sign to get started with Travel Buddy to get into 
          the world of convininece</Text>
        </View>

        <View style={styles.formContainer}>
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton title="Sign In" onPress={onSignInPress} style={styles.signInButton} />

          <OAuth />

          <Link href="/sign-up" style={styles.signUpText}>
            Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
    </LinearGradient>
  );
};

export default SignIn;

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, height: "100%"},
  container1: { flex: 1,},
  imageContainer: { position: "relative", width: "90%", height: 190, marginBottom: 20 },
  title: { position: "absolute", bottom: 20, left: 50, top:100, fontSize: 24, fontWeight: "bold", color: "#000" },
  titles: { position: "absolute", bottom: 0, left: 20, fontSize: 16, fontWeight: "bold", fontFamily: "Jakarta-SemiBold", textAlign: "center", top: 140, color: "#000" },
  formContainer: { padding: 5 },
  signInButton: {
    marginTop: 24, // mt-6
    width: "90%",
    marginLeft: 20
  },
  signUpText: {
    fontSize: 18, // text-lg
    textAlign: "center",
    color: "#000", // text-general-200
    marginTop: 40, // mt-10
    fontWeight:"bold"
    
  },
  signUpLink: {
    color: "#3737ff", // text-primary-500
  },
});
