import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import { useAuth, useUser } from "@clerk/clerk-expo";
import { fetchAPI } from "@/lib/fetch";
import { icons } from '@/constants';

interface Booking {
  amount: any;
  id: string;
  sender_name: string;
  sender_location: string;
  sender_mobile: string;
  receiver_name: string;
  receiver_location: string;
  receiver_mobile: string;
  package_type: string;
  weight: string;
  created_at: string;
  status: string;
}

const PendingOrderScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const fetchPendingBookings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log("Fetching bookings for user:", user.id);
      const response = await fetchAPI(`/(api)/booking?clerkId=${user.id}`);
      console.log("Raw API Response:", JSON.stringify(response, null, 2));
      
      if (response.success && response.bookings) {
        // Filter for pending bookings
        const pendingBookings = response.bookings.filter(
          (booking: Booking) => booking.status === 'pending'
        );
        console.log("Filtered pending bookings:", JSON.stringify(pendingBookings, null, 2));
        
        if (pendingBookings.length > 0) {
          console.log("First booking details:", {
            bookingId: pendingBookings[0].id,
            sender_mobile: pendingBookings[0].sender_mobile,
            receiver_mobile: pendingBookings[0].receiver_mobile,
            sender_name: pendingBookings[0].sender_name,
            receiver_name: pendingBookings[0].receiver_name,
            amount: pendingBookings[0].amount
          });
        } else {
          console.log("No pending bookings found");
        }
        
        setBookings(pendingBookings);
      } else {
        console.log("No bookings found in response or response not successful");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBookings();
  }, [user]);

  const renderBookingItem = ({ item }: { item: Booking }) => {
    console.log("Rendering booking item:", item);
    console.log("Mobile numbers in item:", item.sender_mobile, item.receiver_mobile);
    return (
    <View style={styles.orderContainer}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{item.id}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
      <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Sender Name:</Text>
            <Text style={styles.value}>{item.sender_name || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Mobile:</Text>
            <Text style={styles.value}>{item.sender_mobile || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Receiver Name:</Text>
            <Text style={styles.value}>{item.receiver_name || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Mobile:</Text>
            <Text style={styles.value}>{item.receiver_mobile || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Pickup:</Text>
            <Text style={styles.value}>{item.sender_location || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Delivery:</Text>
            <Text style={styles.value}>{item.receiver_location || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{item.package_type || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Weight:</Text>
            <Text style={styles.value}>{item.weight ? `${item.weight}kg` : 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Amount:</Text>
            <Text style={styles.value}>{item.amount ? `${item.amount} UGshs` : 'N/A'}</Text>
          </View>
      </View>
      <TouchableOpacity 
        style={styles.payButton} 
          onPress={() => router.push({
            pathname: "/(root)/payment",
            params: { 
              bookingId: item.id,
              amount: item.amount
            }
          })}
      >
        <Text style={styles.payButtonText}>Pay</Text>
      </TouchableOpacity>
    </View>
  );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2980b9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchPendingBookings}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

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
        <Text style={styles.headerText}>Pending Orders</Text>
      </View>
      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No pending orders found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  headerText: {
    color: '#ecf0f1',
    fontSize: 22,
    fontWeight: '700',
  },
  listContainer: {
    padding: 20,
  },
  orderContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
  },
  status: {
    color: '#e67e22',
    fontWeight: '600',
    fontSize: 16,
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#bdc3c7',
    paddingTop: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'JakartaMedium',
    flex: 0.4,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'JakartaSemiBold',
    flex: 0.6,
    textAlign: 'right',
  },
  payButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  payButtonText: {
    color: '#ecf0f1',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#ecf0f1',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default PendingOrderScreen;
