import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth, useUser } from "@clerk/clerk-expo";
import { fetchAPI } from "@/lib/fetch";

interface Booking {
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
      const response = await fetchAPI(`/(api)/booking?clerkId=${user.id}`);
      
      if (response.success && response.bookings) {
        // Filter for pending bookings
        const pendingBookings = response.bookings.filter(
          (booking: Booking) => booking.status === 'pending'
        );
        setBookings(pendingBookings);
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

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <View style={styles.orderContainer}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{item.id}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.label}>Sender Name: {item.sender_name}</Text>
        <Text style={styles.label}>Mobile Number: {item.sender_mobile}</Text>
        <Text style={styles.label}>Receiver Name: {item.receiver_name}</Text>
        <Text style={styles.label}>Mobile Number: {item.receiver_mobile}</Text>
        <Text style={styles.label}>Pickup Address: {item.sender_location}</Text>
        <Text style={styles.label}>Delivery Address: {item.receiver_location}</Text>
        <Text style={styles.label}>Date: {new Date(item.created_at).toLocaleDateString()}</Text>
        <Text style={styles.label}>Category: {item.package_type}</Text>
        <Text style={styles.label}>Weight: {item.weight}kg</Text>
      </View>
      <TouchableOpacity 
        style={styles.payButton} 
        onPress={() => router.push('/payment')}
      >
        <Text style={styles.payButtonText}>Pay</Text>
      </TouchableOpacity>
    </View>
  );

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
    backgroundColor: '#2c3e50',
    padding: 20,
    alignItems: 'center',
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
  label: {
    fontSize: 15,
    marginBottom: 6,
    color: '#7f8c8d',
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
