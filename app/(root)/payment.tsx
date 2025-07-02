import React, { useState, useEffect } from "react";
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
  Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { icons } from "@/constants";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { fetchAPI } from "@/lib/fetch";

const mtnLogo = require("@/assets/images/mtn.png");
const airtelLogo = require("@/assets/images/airtel.png");

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
    accessibilityLabel={`Select ${title} payment method`}
    accessibilityRole="button"
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
    accessibilityLabel={`Select ${provider} provider`}
    accessibilityRole="button"
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
  const { bookingId, amount: initialAmount } = useLocalSearchParams();
  const { user } = useUser();
  const [selectedPayment, setSelectedPayment] = useState<"wallet" | "mobile">("wallet");
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(initialAmount?.toString() || "0");
  const [selectedProvider, setSelectedProvider] = useState<"mtn" | "airtel">("mtn");
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      Alert.alert("Error", "No booking selected");
      router.back();
      return;
    }

    if (initialAmount) {
      setAmount(initialAmount.toString());
      setLoading(false);
    } else {
      fetchBookingDetails();
    }
  }, [bookingId, initialAmount]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetchAPI(`/(api)/booking?clerkId=${user?.id}`);
      
      if (response.success && response.bookings) {
        const booking = response.bookings.find((b: any) => b.id === bookingId);
        if (booking) {
          setBookingDetails(booking);
          setAmount(booking.amount?.toString() || "0");
        } else {
          Alert.alert("Error", "Booking not found");
          router.back();
        }
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      Alert.alert("Error", "Failed to fetch booking details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const validatePhoneNumber = (number: string, provider: "mtn" | "airtel") => {
    // Remove all non-digit characters (e.g., spaces, dashes, etc.)
    let cleaned = number.replace(/\D/g, '');
  
    // Only allow exactly 10 digits, starting with 0
    if (cleaned.length !== 10 || !cleaned.startsWith("0")) {
      return false;
    }
  
    if (provider === "mtn") {
      // Valid MTN prefixes: 077, 078, 076, 070, 039
      return /^(077|078|076|070|039)/.test(cleaned);
    } else {
      // Valid Airtel prefixes: 075, 070, 078, 077
      return /^(075|070|078|077)/.test(cleaned);
    }
  };
  

  const formatCurrency = (value: string) => {
    return parseFloat(value).toLocaleString('en-US');
  };

  const handlePaymentConfirmation = () => {
    Alert.alert(
      "Confirm Payment",
      `Are you sure you want to pay Shs ${formatCurrency(amount)} via ${
        selectedPayment === "mobile" 
          ? `${selectedProvider.toUpperCase()} Mobile Money` 
          : "Wallet"
      }?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm", 
          onPress: selectedPayment === "mobile" 
            ? handleSubmitPayment 
            : handleWalletPayment 
        }
      ]
    );
  };

  const handleSubmitPayment = async () => {
    if (!validatePhoneNumber(phoneNumber, selectedProvider)) {
      setError("Please enter a valid phone number for the selected provider");
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!user?.id || !bookingId) {
      setError("Missing user ID or booking ID");
      return;
    }

    try {
      setProcessingPayment(true);
      setError(null);
      
      const result = await fetchAPI("/(api)/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user?.id,
          amount: amount,
          provider: "mobile_money",
          transactionType: "profit",
          description: "Mobile money payment for booking",
          phoneNumber: phoneNumber,
        }),
      });

      if (!result.success) {
        throw new Error(result.error || "Payment failed");
      }

      const updateResult = await fetchAPI("/(api)/booking", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingId,
          status: "complete",
        }),
      });

      if (!updateResult.success) {
        throw new Error(updateResult.error || "Failed to update booking status");
      }

      setModalVisible(false);
      router.push("./(tabs)/home");
    } catch (error: any) {
      console.error("Payment error:", error);
      setError(error.message || "Failed to process payment");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleWalletPayment = async () => {
    if (!user?.id || !bookingId) {
      setError("Missing user ID or booking ID");
      return;
    }

    try {
      setProcessingPayment(true);
      setError(null);
      
      const result = await fetchAPI("/(api)/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user?.id,
          amount: amount,
          provider: "wallet",
          transactionType: "debit",
          description: "Wallet payment for booking",
        }),
      });

      if (!result.success) {
        throw new Error(result.error || "Payment failed");
      }

      const updateResult = await fetchAPI("/(api)/booking", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingId,
          status: "complete",
        }),
      });

      if (!updateResult.success) {
        throw new Error(updateResult.error || "Failed to update booking status");
      }

      router.push("./(tabs)/home");
    } catch (error: any) {
      console.error("Payment error:", "insufficient Balance");
      setError(error.message || "Failed to process payment");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3737ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
          accessibilityRole="button"
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
        
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error === "insufficient Balance" ? "Insufficient Balance" : error}
            </Text>
          </View>
        

        <Text style={styles.sectionTitle}>Choose Payment Method</Text>

        {/* Amount Display */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount to Pay:</Text>
          <Text style={styles.amountValue}>Shs {formatCurrency(amount)}</Text>
        </View>

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
            onSelect={() => {
              setSelectedPayment("mobile");
              setModalVisible(true);
            }}
          >
            <View style={styles.paymentLogos}>
              <Image source={mtnLogo} style={styles.logoImage} />
              <Image source={airtelLogo} style={styles.logoImage} />
            </View>
          </PaymentOption>
        </View>

        {/* Pay button */}
        <TouchableOpacity 
          style={[styles.payButton, processingPayment && styles.disabledButton]}
          activeOpacity={0.8}
          onPress={handlePaymentConfirmation}
          disabled={processingPayment}
          accessibilityLabel={`Pay Shs ${formatCurrency(amount)}`}
          accessibilityRole="button"
        >
          {processingPayment ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pay Shs {formatCurrency(amount)}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelPaymentButton}
          activeOpacity={0.8}
          onPress={() => router.push("./(tabs)/home")}
          accessibilityLabel="Cancel payment and return home"
          accessibilityRole="button"
        >
          <Text style={styles.cancelPaymentButtonText}>Pay Later</Text>
        </TouchableOpacity>
      </View>

      {/* Mobile Money Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => !processingPayment && setModalVisible(false)}
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
                onChangeText={(text) => {
                  // Only allow up to 10 digits
                  const cleaned = text.replace(/\D/g, '');
                  if (cleaned.length <= 10) {
                    setPhoneNumber(cleaned);
                  }
                }}
                keyboardType="phone-pad"
                editable={!processingPayment}
                placeholderTextColor="#999"
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
                editable={!processingPayment}
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => !processingPayment && setModalVisible(false)}
                disabled={processingPayment}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.submitButton, processingPayment && styles.disabledButton]}
                onPress={handleSubmitPayment}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 1 },
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
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "JakartaBold",
    color: '#333',
    marginBottom: 16,
  },
  paymentOptionsContainer: {
    marginBottom: 24,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontFamily: "JakartaSemiBold",
    color: '#333',
  },
  paymentLogos: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  logoImage: {
    width: 24,
    height: 24,
    marginRight: 8,
    resizeMode: 'contain',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#3737FF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3737FF',
  },
  payButton: {
    backgroundColor: '#3737FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  payButtonText: {
    color: '#fff',
    fontFamily: 'JakartaBold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#a0a0ff',
    opacity: 0.8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'JakartaBold',
    color: '#333',
    marginBottom: 20,
  },
  providerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  providerOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 6,
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
    width: 24,
    height: 24,
    marginRight: 8,
    resizeMode: 'contain',
  },
  providerText: {
    fontSize: 14,
    fontFamily: 'JakartaSemiBold',
    color: '#555',
  },
  providerTextSelected: {
    color: '#3737FF',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'JakartaMedium',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'JakartaRegular',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#555',
    fontSize: 16,
    fontFamily: 'JakartaMedium',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#3737FF',
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 12,
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'JakartaMedium',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  amountContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  amountLabel: {
    fontSize: 16,
    fontFamily: "JakartaMedium",
    color: '#666',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 28,
    fontFamily: "JakartaBold",
    color: '#333',
  },
  cancelPaymentButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelPaymentButtonText: {
    color: '#666',
    fontFamily: 'JakartaMedium',
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontFamily: "JakartaMedium",
    fontSize: 14,
    textAlign: 'center',
  },
});

export default PaymentScreen;