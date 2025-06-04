import * as React from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import WelcomeHeader from "@/components/WelcomeHeader";
import AdvertBanner from "@/components/AdvertBanner";
import ActionButton from "@/components/ActionButton";
import { icons } from "@/constants";
import { router } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { fetchAPI } from "@/lib/fetch";
import registerNNPushToken from 'native-notify';

// Define Ride type
interface Ride {
  id: string;
  rideId: string;
  pickup: string;
  destination: string;
  date: string;
  status: 'pending' | 'complete' | 'draft';
}

// Recent ride item component
const RecentRideItem: React.FC<{ ride: Ride }> = ({ ride }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'draft':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.rideItem}
      onPress={() => router.push(`/(root)/pending`)}
    >
      <View style={styles.rideContent}>
        <View style={styles.rideHeader}>
          <Text style={styles.rideId}>{ride.rideId}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ride.status) }]}>
            <Text style={styles.statusText}>{ride.status}</Text>
          </View>
        </View>
        <View style={styles.routeInfo}>
          <View style={styles.location}>
            <Image source={icons.map} style={styles.locationIcon} />
            <Text style={styles.locationText}>{ride.pickup}</Text>
          </View>
          <View style={styles.locationRow}>
            <View style={styles.location}>
              <Image source={icons.map} style={styles.locationIcon} />
              <Text style={styles.locationText}>{ride.destination}</Text>
            </View>
            <Text style={styles.date}>{ride.date}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Horizontal list of recent bookings
const RecentBookings: React.FC<{ rides: Ride[]; limit?: number }> = ({ rides, limit = 3 }) => {
  const recent = rides.slice(0, limit);
  return (
    <View style={styles.recentContainer}>
      <Text style={styles.sectionTitle}>Recent Bookings</Text>
      <FlatList
        data={recent}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <RecentRideItem ride={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
};

const HOME: React.FC = () => {
  
  const { userId } = useAuth();
  const [bookings, setBookings] = React.useState<Ride[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const { user } = useUser();
  registerNNPushToken(30506, 'ZdQPm17wXDeF23KuP0X7hz');
  // Fetch user's bookings
  const fetchBookings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetchAPI(`/(api)/booking?clerkId=${user.id}`);
      
      if (response.success && response.bookings) {
        // Transform the bookings data to match the Ride type
        const transformedBookings = response.bookings.map((booking: any) => ({
          id: booking.id.toString(),
          rideId: `#BKD${booking.id.toString().padStart(6, '0')}`,
          pickup: booking.sender_location,
          destination: booking.receiver_location,
          date: new Date(booking.created_at).toLocaleDateString(),
          status: booking.status || 'draft'
        }));
        
        setBookings(transformedBookings);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  React.useEffect(() => {
    fetchBookings();
  }, [userId]);

  // Handle refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchBookings();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#3737ff"
        />
      }
    >
      <WelcomeHeader userName={user?.emailAddresses[0].emailAddress.split( "6")[0] + "👋"} notificationCount={3} />
      <AdvertBanner imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/51950e43f6c8bb7d9c82f3b281ad0bfea6fc3e45?placeholderIfAbsent=true&apiKey=d0abf0f57c184d169e2497766c802d1f" />

      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>What are we doing today?</Text>
      </View>

      <View style={styles.actionsContainer}>
        <ActionButton
          iconUrl={icons.Send}
          label="Send package"
          onPress={() => router.push("/courier1")}
          iconAspectRatio={0.98}
        />
        <ActionButton
          iconUrl={icons.Send}
          label="Receive package"
          onPress={() => router.push("/receive")}
          iconAspectRatio={0.98}
        />
      </View>

      {/* Recent Bookings */}
      <RecentBookings rides={bookings} limit={3} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    marginTop: 1,
    paddingHorizontal: 1,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f8f9fa",
    paddingBottom: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    fontFamily: 'JakartaMedium',
    textAlign: 'center',
  },
  sectionTitleContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'JakartaBold',
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  recentContainer: {
    marginTop: 30,
    marginBottom: 24,
  },
  rideItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  rideContent: {
    flex: 1,
  },
  rideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rideId: {
    fontSize: 14,
    fontFamily: 'JakartaBold',
    color: "#1a1a1a",
    letterSpacing: -0.3,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    minWidth: 70,
    alignItems: 'center',
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: 'JakartaSemiBold',
    textTransform: 'capitalize',
  },
  routeInfo: {
    marginBottom: 8,
    gap: 6,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  locationIcon: {
    width: 16,
    height: 16,
    tintColor: "#3737ff",
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'JakartaMedium',
    color: "#4a4a4a",
    flex: 1,
  },
  date: {
    fontSize: 11,
    fontFamily: 'JakartaRegular',
    color: "#8e8e93",
    marginLeft: 8,
  },
});

export default HOME;
