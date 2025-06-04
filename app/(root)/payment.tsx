import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Modal, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";
import { router } from "expo-router";
import { icons } from "@/constants";

// Assuming you'll add these images to your assets
// If not already in constants, you'll need to add them or require directly
const mtnLogo = require("@/assets/images/mtn.png"); // Add your MTN logo
const airtelLogo = require("@/assets/images/airtel.png"); // Add your Airtel logo

// Payment option component with radio button
const PaymentOption = ({ 
  title, 
  isSelected, 
  onSelect, 
  children 
}: { 
  title: string; 
  isSelected: boolean; 
  onSelect: () => void;
  children?: React.ReactNode;
}) => (
  <TouchableOpacity 
    style={styles.paymentOption} 
    activeOpacity={0.7}
    onPress={onSelect}
  >
    <View style={styles.paymentOptionContent}>
      <Text style={styles.paymentOptionTitle}>{title}</Text>
      {children}
    </View>
    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
      {isSelected && <View style={styles.radioInner} />}
    </View>
  </TouchableOpacity>
);

// Provider selection option
const ProviderOption = ({
  provider,
  logo,
  isSelected,
  onSelect
}: {
  provider: string;
  logo: any;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <TouchableOpacity
    style={[
      styles.providerOption,
      isSelected && styles.providerOptionSelected
    ]}
    onPress={onSelect}
    activeOpacity={0.7}
  >
    <Image source={logo} style={styles.providerLogo} />
    <Text style={[
      styles.providerText,
      isSelected && styles.providerTextSelected
    ]}>
      {provider}
    </Text>
  </TouchableOpacity>
);

const PaymentScreen = () => {
  const [selectedPayment, setSelectedPayment] = useState<"wallet" | "mobile">("wallet");
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<"mtn" | "airtel">("mtn");

  const handleMobileMoneySelect = () => {
    setSelectedPayment("mobile");
    setModalVisible(true);
  };

  const handleSubmitPayment = () => {
    console.log("Processing payment:", { 
      method: "mobile", 
      provider: selectedProvider,
      phoneNumber, 
      amount 
    });
    setModalVisible(false);
    setSuccessModalVisible(true);
    // After 2 seconds, navigate to home
    setTimeout(() => {
      setSuccessModalVisible(false);
      router.replace("/");
    }, 2000);
  };

  const handleWalletPayment = () => {
    console.log("Processing wallet payment");
    setSuccessModalVisible(true);
    // After 2 seconds, navigate to home
    setTimeout(() => {
      setSuccessModalVisible(false);
      router.replace("/");
    }, 2000);
  };

  return (
    <ScrollView style={styles.scrollView}>
      {/* Header */}
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
        <Text style={styles.title}>Payment</Text>
      </View>

      {/* Main content */}
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>

        {/* Payment options */}
        <View style={styles.paymentOptionsContainer}>
          <PaymentOption 
            title="Wallet" 
            isSelected={selectedPayment === "wallet"}
            onSelect={() => setSelectedPayment("wallet")}
          />
          
          <PaymentOption 
            title="Mobile Money" 
            isSelected={selectedPayment === "mobile"}
            onSelect={handleMobileMoneySelect}
          >
            <View style={styles.paymentLogos}>
              <Image source={mtnLogo} style={styles.logoImage} />
              <Image source={airtelLogo} style={styles.logoImage} />
            </View>
          </PaymentOption>
        </View>

        {/* Pay button */}
        <TouchableOpacity 
          style={styles.payButton}
          activeOpacity={0.8}
          onPress={() => {
            if (selectedPayment === "mobile") {
              setModalVisible(true);
            } else {
              handleWalletPayment();
            }
          }}
        >
          <Text style={styles.payButtonText}>Pay</Text>
        </TouchableOpacity>
      </View>

      {/* Mobile Money Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mobile Money Payment</Text>
            
            {/* Provider Selection */}
            <View style={styles.providerContainer}>
              <ProviderOption
                provider="MTN"
                logo={mtnLogo}
                isSelected={selectedProvider === "mtn"}
                onSelect={() => setSelectedProvider("mtn")}
              />
              <ProviderOption
                provider="Airtel"
                logo={airtelLogo}
                isSelected={selectedProvider === "airtel"}
                onSelect={() => setSelectedProvider("airtel")}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmitPayment}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <Image 
                source={icons.checkmark} 
                style={styles.successIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successMessage}>Your payment has been processed successfully.</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f8f9fa',
  },
  header: {
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24,
    backgroundColor: "#3737ff",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 100,
    position: "absolute",
    left: 16,
    top: 48,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backIcon: {
    width: 16,
    height: 16,
    tintColor: "#3737ff",
  },
  title: {
    color: "#fff",
    fontFamily: "JakartaBold",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 16,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "JakartaBold",
    color: '#333',
    marginBottom: 12,
  },
  paymentOptionsContainer: {
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentOptionTitle: {
    fontSize: 14,
    fontFamily: "JakartaSemiBold",
    color: '#333',
  },
  paymentLogos: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  logoImage: {
    width: 20,
    height: 20,
    marginRight: 4,
    resizeMode: 'contain',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#3737FF',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3737FF',
  },
  payButton: {
    backgroundColor: '#3737FF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
  },
  payButtonText: {
    color: '#fff',
    fontFamily: 'JakartaBold',
    fontSize: 16,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'JakartaBold',
    color: '#333',
    marginBottom: 16,
  },
  // Provider selection styles
  providerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  providerOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  providerOptionSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#3737FF',
  },
  providerLogo: {
    width: 20,
    height: 20,
    marginRight: 6,
    resizeMode: 'contain',
  },
  providerText: {
    fontSize: 12,
    fontFamily: 'JakartaSemiBold',
    color: '#555',
  },
  providerTextSelected: {
    color: '#3737FF',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: 'JakartaMedium',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: 'JakartaRegular',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#555',
    fontSize: 14,
    fontFamily: 'JakartaMedium',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#3737FF',
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'JakartaMedium',
  },
  // Success Modal Styles
  successModalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  successIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  successTitle: {
    fontSize: 18,
    fontFamily: 'JakartaBold',
    color: '#333',
    marginBottom: 6,
  },
  successMessage: {
    fontSize: 14,
    fontFamily: 'JakartaRegular',
    color: '#666',
    textAlign: 'center',
  },
});

export default PaymentScreen;
