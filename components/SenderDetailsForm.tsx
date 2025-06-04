import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import InputField from "@/components/InputField";
import ProceedButton from "@/components/ProceedButton";
import { router } from "expo-router";
import { useFormStore } from "@/store/useFormStore";
import { useFocusEffect } from "@react-navigation/native";

const SenderDetailsForm: React.FC = () => {
  const updateSender = useFormStore((state) => state.updateSender);
  const sender = useFormStore((state) => state.sender);

  const [form, setForm] = useState({
    senderName: "",
    senderMobileNumber: "",
    senderLocation: "",
    senderStreet: "",
    senderEstate: "",
  });

  // Rehydrate local form from Zustand when returning to this screen
  useFocusEffect(
    useCallback(() => {
      setForm(sender);
    }, [sender])
  );

  const handleProceed = () => {
    updateSender(form); // Save to Zustand
    console.log(form);
    router.push("/courier2"); // Navigate to next step
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Sender Details</Text>
          <Text style={styles.subtitle}>Enter the details below</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.card}>
            <InputField
              label="Sender Name"
              placeholder="Enter your full name"
              value={form.senderName}
              onChangeText={(value) => handleChange("senderName", value)}
              style={styles.inputContainer}
              autoCapitalize="words"
            />

            <InputField
              label="Mobile number"
              placeholder="Enter your 10 digit no"
              value={form.senderMobileNumber}
              onChangeText={(value) => handleChange("senderMobileNumber", value)}
              style={styles.inputContainer}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <InputField
              label="Location"
              placeholder="Sending From"
              value={form.senderLocation}
              onChangeText={(value) => handleChange("senderLocation", value)}
              style={styles.inputContainer}
            />
          </View>

          <View style={[styles.card, styles.addressCard]}>
            <Text style={styles.addressLabel}>Pick up Address</Text>
            <View style={styles.addressInputs}>
              <InputField
                label="Street name"
                placeholder="Street name"
                value={form.senderStreet}
                onChangeText={(value) => handleChange("senderStreet", value)}
                style={styles.streetInput}
              />

              <InputField
                label="Estate name"
                placeholder="Estate name"
                value={form.senderEstate}
                onChangeText={(value) => handleChange("senderEstate", value)}
                style={styles.streetInput}
              />
            </View>
          </View>

          <ProceedButton
            onPress={handleProceed}
            disabled={Object.values(form).some((value) => value === "")}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 30,
  },
  headerContainer: {
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  title: {
    color: "#1a1a1a",
    fontFamily: "Jakarta-Bold",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Jakarta-Regular",
    letterSpacing: -0.32,
    color: "#666",
  },
  formContainer: {
    gap: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  addressCard: {
    paddingTop: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  addressLabel: {
    color: "#000",
    fontFamily: "Jakarta-Bold",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  addressInputs: {
    gap: 16,
  },
  streetInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    fontFamily: "Jakarta-Semibold",
  },
});

export default SenderDetailsForm;
