import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import InputField from "@/components/InputField";
import ProceedButton from "@/components/ProceedButton";
import { router } from "expo-router";
import { useFormStore } from "@/store/useFormStore";
import { useFocusEffect } from "@react-navigation/native";

const ReceiverDetailsForm: React.FC = () => {
  const updateReceiver = useFormStore((state) => state.updateReceiver);
  const receiver = useFormStore((state) => state.receiver);

  const [form, setForm] = useState({
    receiverName: "",
    receiverMobileNumber: "",
    receiverLocation: "",
    receiverStreet: "",
    receiverEstate: "",
  });

  // Rehydrate form state on screen focus
  useFocusEffect(
    useCallback(() => {
      setForm(receiver);
    }, [receiver])
  );

  const handleProceed = () => {
    updateReceiver(form);
    console.log(form);
    router.push("/courier3");
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
          <Text style={styles.title}>Receiver Details</Text>
          <Text style={styles.subtitle}>Enter the receiver's details below</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.card}>
            <InputField
              label="Receiver Name"
              placeholder="Enter receiver's full name"
              value={form.receiverName}
              onChangeText={(value) => handleChange("receiverName", value)}
              style={styles.inputContainer}
              autoCapitalize="words"
            />

            <InputField
              label="Mobile number"
              placeholder="Enter 10 digit number"
              value={form.receiverMobileNumber}
              onChangeText={(value) => handleChange("receiverMobileNumber", value)}
              style={styles.inputContainer}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <InputField
              label="Location"
              placeholder="Delivering To"
              value={form.receiverLocation}
              onChangeText={(value) => handleChange("receiverLocation", value)}
              style={styles.inputContainer}
            />
          </View>

          <View style={[styles.card, styles.addressCard]}>
            <Text style={styles.addressLabel}>Delivery Address</Text>
            <View style={styles.addressInputs}>
              <InputField
                label="Street"
                placeholder="Street name"
                value={form.receiverStreet}
                onChangeText={(value) => handleChange("receiverStreet", value)}
                style={styles.streetInput}
              />

              <InputField
                label="Estate"
                placeholder="Estate name"
                value={form.receiverEstate}
                onChangeText={(value) => handleChange("receiverEstate", value)}
                style={styles.streetInput}
              />
            </View>
          </View>

          <ProceedButton
            onPress={handleProceed}
            disabled={Object.values(form).some((val) => val === "")}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContent: { flexGrow: 1 },
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
  formContainer: { gap: 24 },
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
  addressCard: { paddingTop: 24 },
  inputContainer: { marginBottom: 20 },
  addressLabel: {
    color: "#000",
    fontFamily: "Jakarta-Bold",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  addressInputs: { gap: 16 },
  streetInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
});

export default ReceiverDetailsForm;
