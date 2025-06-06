import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, Alert } from "react-native";
import HeaderSection from "@/components/HeaderSection";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { useFormStore } from "@/store/useFormStore";
import { fetchAPI } from "@/lib/fetch";
import { useAuth } from "@clerk/clerk-expo";

const DetailRow = ({ label, value, textStyle }: { label: string; value: string; textStyle?: any }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, textStyle]}>{value}</Text>
  </View>
);

const Courier4Screen: React.FC = () => {
  const { getFormData, packaged, resetForm } = useFormStore();
  const formData = getFormData();
  const packageData = packaged;

  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const RightArrowIcon = () => (
    <Image source={icons.frontArrow} style={styles.buttonArrowIcon} />
  );

  // Calculate charges
  const baseCharge = 20000;
  const fragileCharge = packageData.isFragile ? 5000 : 0;
  const trackingCharge = packageData.hasTracking ? 5000 : 0;
  const totalAmount = baseCharge + fragileCharge + trackingCharge;

  // Format date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  const handleProceed = async () => {
    if (!userId) {
      Alert.alert("Authentication Error", "User not authenticated");
      return;
    }
    setIsLoading(true);
    try {
      // Create a plain object instead of FormData
      const payload = {
        // Sender info
        sender_name: formData.sender.senderName,
        sender_location: formData.sender.senderLocation,
        sender_mobile: formData.sender.senderMobileNumber,
        sender_estate: formData.sender.senderEstate,
        sender_street: formData.sender.senderStreet,
        
        // Receiver info
        receiver_name: formData.receiver.receiverName,
        receiver_location: formData.receiver.receiverLocation,
        receiver_mobile: formData.receiver.receiverMobileNumber,
        receiver_estate: formData.receiver.receiverEstate,
        receiver_street: formData.receiver.receiverStreet,
        
        // Package info
        selected_type: formData.packaged.type,
        is_fragile: packageData.isFragile,
        is_tracking: formData.packaged.hasTracking,
        description: formData.packaged.description,
        weight: formData.packaged.weight,
        delivery_mean: formData.packaged.deliveryMeans ?? "",
        clerk_id: userId,
        
        // Image handling
        image_url: packageData.image,

        // Amount
        amount: totalAmount
      };
      
      console.log("Payload contents:", payload);
      console.log("Mobile numbers in payload:", {
        sender: payload.sender_mobile,
        receiver: payload.receiver_mobile
      });
      
      // Send the payload directly without nesting it
      const result = await fetchAPI("/(api)/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
  
      console.log("Booking success:", result);
      
      if (result.success && result.bookingId) {
        // Reset the form after successful booking
        resetForm();
        
        router.push({
          pathname: "/(root)/payment",
          params: { 
            bookingId: result.bookingId,
            amount: totalAmount.toString()
          }
        });
      } else {
        throw new Error("Failed to create booking");
      }
  
    } catch (err: any) {
      console.error("Booking failed:", err);
      Alert.alert("Booking Error", err.message || "Failed to create booking. Please try again.");
  } finally {
    // Set loading to false regardless of success or failure
    setIsLoading(false);
  }
};

  return (
    <ScrollView style={styles.scrollView}>
      <HeaderSection />

      <View style={styles.container}>
        {/* Receiver Details Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Receiver Details</Text>
          <View style={styles.card}>
            <DetailRow label="Receiver Name" value={formData.receiver.receiverName} />
            <DetailRow label="Mobile Number" value={formData.receiver.receiverMobileNumber} />
            <DetailRow label="Location" value={formData.receiver.receiverLocation} />
            <DetailRow label="Date" value={formattedDate} />
          </View>
        </View>

        {/* About package Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About package</Text>
          <View style={styles.card}>
            <DetailRow label="Category" value={packageData.type} />
            <DetailRow label="Weight" value={`${packageData.weight}kg`} />
            <DetailRow label="Quantity" value="1" />
            <DetailRow label="Fragile" value={packageData.isFragile ? "Yes (+Shs 5,000)" : "No"} />
          </View>
        </View>

        {/* Package Image Section */}
        {packageData.image && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Package Image</Text>
            <View style={styles.card}>
              <Image 
                source={{ uri: packageData.image }} 
                style={styles.packageImage} 
                resizeMode="contain"
              />
            </View>
          </View>
        )}

        {/* Delivery Means Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Delivery Method</Text>
          <View style={styles.card}>
            <DetailRow 
              label="Service" 
              value={packageData.deliveryMeans|| "Not selected"} 
            />
          </View>
        </View>

        {/* Amount Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <View style={styles.card}>
            <DetailRow label="Base Charge" value={`Shs ${baseCharge.toLocaleString()}`} />
            {packageData.isFragile && (
              <DetailRow label="Fragile Item Fee" value={`Shs ${fragileCharge.toLocaleString()}`} />
            )}
            {packageData.hasTracking && (
              <DetailRow label="Tracking Service" value={`Shs ${trackingCharge.toLocaleString()}`} />
            )}
            <DetailRow 
              label="Total Amount" 
              value={`Shs ${totalAmount.toLocaleString()}`} 
              textStyle={styles.totalAmountText}
            />
          </View>
        </View>

        {/* Proceed Button */}
        <CustomButton
          title="Proceed to payment"
          onPress={handleProceed}
          style={styles.proceedButton}
          IconRight={RightArrowIcon}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#f8f9fa',
    width: '100%',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "JakartaBold",
    color: '#333',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: "JakartaRegular",
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: "JakartaSemiBold",
    color: '#333',
  },
  totalAmountText: {
    fontSize: 16,
    fontFamily: "JakartaBold",
    color: '#3737FF',
  },
  proceedButton: {
    backgroundColor: '#3737FF',
    borderRadius: 25,
    marginTop: 10,
    paddingVertical: 14,
  },
  buttonArrowIcon: {
    width: 18,
    height: 18,
    tintColor: '#fff',
    marginLeft: 8,
  },
  packageImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});

export default Courier4Screen;
