import React, { useState, useRef } from "react";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from "react-native";
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: ["", "", "", "" ,"", ""], // OTP stored as an array of digits
  });

  const inputRefs = useRef([]);

  const handleOTPChange = (text, index) => {
    if (text.length > 1) return;
    let newCode = [...verification.code];
    newCode[index] = text;
    setVerification({ ...verification, code: newCode });

    // Move to next input field automatically
    if (text && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({ ...verification, state: "pending" });
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code.join(""), // Combine digits into a full code
      });

      if (completeSignUp.status === "complete") {

          await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });
        router.push(`/(root)/(tabs)/home`);
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({ ...verification, state: "success" });
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  };

  return (
    <LinearGradient colors={['#3737ff', '#ffffff']} style={styles.container1}>
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Text style={styles.title}>Create Your Buddy Account</Text>
            <Text style={styles.titles}>
              Create an account with Travel Buddy to get into the world of convenience
            </Text>
          </View>

          <View style={styles.formContainer}>
            <InputField
              label="Full name"
              placeholder="Enter name"
              icon={icons.person}
              value={form.name}
              onChangeText={(value) => setForm({ ...form, name: value })}
            />
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
              secureTextEntry
              textContentType="password"
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
            />

            <CustomButton title="Sign Up" onPress={onSignUpPress} style={styles.button} />
            <OAuth />
            <Link href="/sign-in" style={styles.linkText}>
              Already have an account? <Text style={styles.linkHighlight}>Log In</Text>
            </Link>
          </View>

          {/* OTP Modal */}
          <ReactNativeModal
            isVisible={verification.state === "pending"}
            onModalHide={() => { 
              if (verification.state === 'success') setShowSuccessModal(true);
            }}
          >
            <View style={styles.modalContainer}>
            <Image source={images.verifyimage} style={styles.successImage} />
              <Text style={styles.modalTitle}>Verification Code</Text>
              <Text style={styles.modalText}>
              We have  sent a Verification code to.
              </Text>
              <Text style={styles.modalText}>
                {form.email}.
              </Text>

              {/* OTP Input Fields */}
              <View style={styles.otpContainer}>
                {verification.code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(text) => handleOTPChange(text, index)}
                    maxLength={1}
                    keyboardType="numeric"
                  />
                ))}
              </View>

              {verification.error && (
                <Text style={styles.errorText}>{verification.error}</Text>
              )}

              <CustomButton title="Verify Email" onPress={onPressVerify} style={styles.verifyButton} 
              />
            </View>
          </ReactNativeModal>

          {/* Success Modal */}
          {/* <ReactNativeModal isVisible={showSuccessModal}>
            <View style={styles.modalContainer}>
              <Image source={images.check} style={styles.successImage} />
              <Text style={styles.successTitle}>Verified</Text>
              <Text style={styles.successText}>
                You have successfully verified your account.
              </Text>
              <CustomButton title="Browse Home" onPress={() => {
                setShowSuccessModal(false);
                router.push(`/(root)/(tabs)/home`);
              }} />
            </View>
          </ReactNativeModal> */}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, height: "100%" },
  container1: { flex: 1 },
  imageContainer: { position: "relative", width: "90%", height: 180, marginBottom: 20 },
  title: { position: "absolute", bottom: 20, left: 50, top:100, fontSize: 24, fontWeight: "bold", color: "#000" },
  titles: { position: "absolute", bottom: 0, left: 20, fontSize: 16, fontWeight: "bold", fontFamily: "Jakarta-SemiBold", textAlign: "center", top: 140, color: "#000" },
  formContainer: { padding: 5 },
  button: { marginTop: 15, width: "90%", marginLeft: 20 },
  linkText: { fontSize: 18, textAlign: "center", marginTop: 10, color: "#000", fontWeight: "bold" },
  linkHighlight: { color: "#3737ff" },
  modalContainer: { backgroundColor: "#fff", padding: 20, borderRadius: 15, height: "100%"},
  modalTitle: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginTop: 50 },
  modalText: { fontSize: 20, textAlign: "center" },
  otpContainer: { flexDirection: "row", justifyContent: "center", gap: 10, marginTop: 10 },
  otpInput: { width: 45, height: 45, borderRadius: 10, textAlign: "center", fontSize: 20, fontWeight: "bold", borderWidth: 2, borderColor: "#000" },
  verifyButton: { backgroundColor: "#3737ff", marginTop: 30 },
  errorText: { color: "red", fontSize: 14, marginTop: 5 },
  successImage: { width: 110, height: 110, alignSelf: "center", marginBottom: 10, marginTop: 80 , borderRadius: 100,borderColor: "#fff"},
  successTitle: { fontSize: 26, fontWeight: "bold", textAlign: "center" },
  successText: { fontSize: 16, textAlign: "center", color: "gray", marginTop: 5 },
});

export default SignUp;
