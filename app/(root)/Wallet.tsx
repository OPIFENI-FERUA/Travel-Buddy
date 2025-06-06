import React, { useState, useEffect } from "react";
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
  Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import { router } from "expo-router";
import { icons } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import {  useAuth, useUser } from "@clerk/clerk-expo";

// Assuming you'll add these images to your assets
const mtnLogo = require("@/assets/images/mtn.png");
const airtelLogo = require("@/assets/images/airtel.png");

interface Transaction {
  id: string;
  amount: string;
  provider: string;
  transaction_type: 'credit' | 'debit';
  description: string;
  phone_number: string;
  created_at: string;
}

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
  time,
  type
}: {
  transactionId: string;
  amount: string;
  date: string;
  time: string;
  type: 'credit' | 'debit';
}) => (
  <View style={styles.transactionItem}>
    <View style={styles.transactionLeft}>
      <View style={[styles.transactionIcon, type === 'credit' ? styles.creditIcon : styles.debitIcon]}>
        <Text style={styles.iconText}>{type === 'credit' ? '+' : '-'}</Text>
      </View>
      <View>
        <Text style={styles.transactionId}>{transactionId}</Text>
        <Text style={styles.transactionDate}>{date} · {time}</Text>
      </View>
    </View>
    <Text style={[styles.transactionAmount, type === 'credit' ? styles.creditAmount : styles.debitAmount]}>
      {type === 'credit' ? '+' : '-'}UG SHS {amount}
    </Text>
  </View>
);

const WalletScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<"mtn" | "airtel">("mtn");
  const { userId } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoadingTransactions(true);
      const response = await fetchAPI(`/(api)/transactions?clerkId=${user.id}`);
      
      if (response.success) {
        setTransactions(response.transactions);
      } else {
        console.error("Failed to fetch transactions:", response.error);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  // Fetch transactions on mount and after successful transactions
  useEffect(() => {
    fetchTransactions();
  }, [user?.id]);

  // Fetch balance
  const fetchBalance = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoadingBalance(true);
      const response = await fetchAPI(`/(api)/balance?clerkId=${user.id}`);
      
      if (response.success) {
        setBalance(response.balance);
      } else {
        console.error("Failed to fetch balance:", response.error);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Fetch balance on mount and after successful transactions
  useEffect(() => {
    fetchBalance();
  }, [user?.id]);

  const validateTransaction = () => {
    if (!addAmount || isNaN(Number(addAmount)) || Number(addAmount) <= 0) {
      const errorMsg = "Please enter a valid amount";
      console.error("Validation Error:", {
        type: "amount",
        value: addAmount,
        message: errorMsg
      });
      setError(errorMsg);
      return false;
    }
    if (!phoneNumber || phoneNumber.length !== 10) {
      const errorMsg = "Phone number must be exactly 10 digits";
      console.error("Validation Error:", {
        type: "phone",
        value: phoneNumber,
        length: phoneNumber?.length,
        message: errorMsg
      });
      setError(errorMsg);
      return false;
    }
    if (!selectedProvider) {
      const errorMsg = "Please select a provider";
      console.error("Validation Error:", {
        type: "provider",
        value: selectedProvider,
        message: errorMsg
      });
      setError(errorMsg);
      return false;
    }
    return true;
  };

  const handleAddMoney = async () => {
    setError(null);
    
    if (!validateTransaction()) {
      return;
    }

    if (!user?.id) {
      const errorMsg = "User not authenticated";
      console.error("Authentication Error:", {
        userId: user?.id,
        message: errorMsg
      });
      setError(errorMsg);
      return;
    }

    setIsLoading(true);
    
    const transaction = {
      clerkId: user.id,
      amount: addAmount,
      provider: selectedProvider,
      transactionType: "credit",
      description: "Wallet top-up",
      phoneNumber: phoneNumber,
    };

    console.log("Attempting transaction:", {
      amount: addAmount,
      provider: selectedProvider,
      phoneNumber: phoneNumber
    });
  
    try {
      const response = await fetchAPI('/(api)/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });

      if (!response.message || !response.data) {
        console.error("Invalid API Response:", response);
        throw new Error('Invalid response from server');
      }

      console.log("Transaction successful:", {
        message: response.message,
        data: response.data
      });
      
      // Success handling
    setModalVisible(false);
    setAddAmount("");
    setPhoneNumber("");
      Alert.alert("Success", "Money added successfully!");
      
      // Refresh balance and transactions after successful transaction
      fetchBalance();
      fetchTransactions();
      
    } catch (error) {
      console.error("Transaction Error:", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        transaction: {
          amount: addAmount,
          provider: selectedProvider,
          phoneNumber: phoneNumber
        }
      });
      setError(error instanceof Error ? error.message : "Failed to add money. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date and time for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
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
        {isLoadingBalance ? (
          <ActivityIndicator color="#fff" size="small" style={styles.balanceLoader} />
        ) : (
          <Text style={styles.balanceAmount}>UG SHS {balance.toLocaleString()}</Text>
        )}
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
        {isLoadingTransactions ? (
          <ActivityIndicator color="#3737ff" size="small" style={styles.transactionsLoader} />
        ) : transactions.length === 0 ? (
          <Text style={styles.noTransactionsText}>No transactions yet</Text>
        ) : (
        <FlatList
          data={transactions}
            keyExtractor={(item) => item.id?.toString() || `transaction-${item.created_at}`}
            renderItem={({ item }) => {
              const { date, time } = formatDateTime(item.created_at);
              const transactionId = item.id ? `#TRX${item.id.toString().padStart(6, '0')}` : '#TRX000000';
              return (
            <TransactionItem
                  transactionId={transactionId}
              amount={item.amount}
                  date={date}
                  time={time}
                  type={item.transaction_type}
            />
              );
            }}
          showsVerticalScrollIndicator={false}
        />
        )}
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
                onChangeText={(text) => {
                  // Only allow digits and limit to 10 characters
                  const digitsOnly = text.replace(/[^0-9]/g, '').slice(0, 10);
                  setPhoneNumber(digitsOnly);
                }}
                keyboardType="phone-pad"
                maxLength={10}
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
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleAddMoney}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
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
  submitButtonDisabled: {
    opacity: 0.7,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'JakartaRegular',
    marginTop: 8,
    textAlign: 'center',
  },
  balanceLoader: {
    marginTop: 16,
  },
  creditIcon: {
    backgroundColor: '#E6F4EA',
  },
  debitIcon: {
    backgroundColor: '#FCE8E6',
  },
  creditAmount: {
    color: '#34A853',
  },
  debitAmount: {
    color: '#EA4335',
  },
  transactionsLoader: {
    marginTop: 20,
  },
  noTransactionsText: {
    textAlign: 'center',
    color: '#666',
    fontFamily: 'JakartaRegular',
    marginTop: 20,
  },
});

export default WalletScreen;