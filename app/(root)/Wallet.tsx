import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { router } from "expo-router";
import { icons } from "@/constants";

// Assuming you'll add these images to your assets
const mtnLogo = require("@/assets/images/mtn.png");
const airtelLogo = require("@/assets/images/airtel.png");

// Provider selection option component
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

// Transaction item component
const TransactionItem = ({
  transactionId,
  amount,
  date,
  time
}: {
  transactionId: string;
  amount: string;
  date: string;
  time: string;
}) => (
  <View style={styles.transactionItem}>
    <View style={styles.transactionLeft}>
      <View style={styles.transactionIcon}>
        <Text style={styles.iconText}>₵</Text>
      </View>
      <View>
        <Text style={styles.transactionId}>{transactionId}</Text>
        <Text style={styles.transactionDate}>{date} · {time}</Text>
      </View>
    </View>
    <Text style={styles.transactionAmount}>{amount}</Text>
  </View>
);

const WalletScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<"mtn" | "airtel">("mtn");
  
  // Mock transaction data
  const transactions = [
    { id: '1', transactionId: '#BKD646646', amount: 'SHS 25,000', date: '23/02/25', time: '11:00pm' },
    { id: '2', transactionId: '#BKD646646', amount: 'SHS 25,000', date: '23/02/25', time: '11:00pm' },
    { id: '3', transactionId: '#BKD646646', amount: 'SHS 25,000', date: '23/02/25', time: '11:00pm' },
    { id: '4', transactionId: '#BKD646646', amount: 'SHS 25,000', date: '23/02/25', time: '11:00pm' },
    { id: '5', transactionId: '#BKD646646', amount: 'SHS 25,000', date: '23/02/25', time: '11:00pm' },
    { id: '6', transactionId: '#BKD646646', amount: 'SHS 25,000', date: '23/02/25', time: '11:00pm' },
  ];

  const handleAddMoney = () => {
    console.log("Adding money to wallet:", { 
      provider: selectedProvider,
      phoneNumber, 
      amount: addAmount 
    });
    setModalVisible(false);
    setAddAmount("");
    setPhoneNumber("");
    // Implement adding money logic here
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.title}>Wallet</Text>
      </View>

      {/* Balance Section */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Your Balance</Text>
        <Text style={styles.balanceAmount}>SHS 50,000</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add money</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions Section */}
      <View style={styles.transactionsContainer}>
        <Text style={styles.transactionsLabel}>Recent Transactions</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              transactionId={item.transactionId}
              amount={item.amount}
              date={item.date}
              time={item.time}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Add Money Modal */}
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
            <Text style={styles.modalTitle}>Add Money to Wallet</Text>
            
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
                value={addAmount}
                onChangeText={setAddAmount}
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
                onPress={handleAddMoney}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: "#3737ff",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 100,
    position: "absolute",
    left: 20,
    top: 56,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: "#3737ff",
  },
  title: {
    color: "#fff",
    fontFamily: "JakartaBold",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  balanceContainer: {
    backgroundColor: "#3737ff",
    paddingHorizontal: 24,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  balanceLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "JakartaMedium",
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: "#fff",
    fontFamily: "JakartaBold",
    fontSize: 32,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: "#3737ff",
    fontFamily: "JakartaSemiBold",
    fontSize: 14,
  },
  transactionsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  transactionsLabel: {
    color: "#666",
    fontFamily: "JakartaMedium",
    fontSize: 16,
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionId: {
    fontFamily: "JakartaSemiBold",
    fontSize: 14,
    color: '#333',
  },
  transactionDate: {
    fontFamily: "JakartaRegular",
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  transactionAmount: {
    fontFamily: "JakartaBold",
    fontSize: 14,
    color: '#333',
  },
  
  // Modal styles - updated to match payment modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
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
    fontSize: 18,
    fontFamily: 'JakartaBold',
    color: '#333',
    marginBottom: 20,
  },
  // Provider selection styles
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
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'JakartaRegular',
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
    marginRight: 10,
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
    marginLeft: 10,
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'JakartaMedium',
  },
});

export default WalletScreen;