import * as React from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from "react-native";
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
  date: string;
  id: string;
  status: "pending" | "complete" | "draft";
  sender_location: string;
  receiver_location: string;
  created_at: string;
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};

// Recent ride item component
const RecentRideItem: React.FC<{ ride: Ride }> = ({ ride }) => {
  const { date, time } = formatDateTime(ride.created_at);
  const transactionId = ride.id ? `#BKD${ride.id.toString().padStart(6, '0')}` : '#BKD000000';
  
  return (
    <TouchableOpacity
      style={styles.recentRideItem}
      onPress={() => {
        if (ride.status === "pending") {
          router.push('/pending');
        }
      }}
    >
      <View style={styles.rideHeader}>
        <View style={styles.rideIdContainer}>
          <Text style={styles.rideId}>{transactionId.substring(0, 12)}</Text>
          <Text style={styles.dateText}>{ride.date}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          ride.status === "pending" ? styles.pendingBadge : 
          ride.status === "complete" ? styles.completedBadge : styles.draftBadge
        ]}>
          <Text style={styles.statusText}>
            {ride.status === "pending" ? "Pending" : 
             ride.status === "complete" ? "Complete" : "Draft"}
          </Text>
        </View>
      </View>
      
      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <View style={styles.locationItem}>
            <View style={styles.locationIconContainer}>
              <Image source={icons.map} style={styles.locationIcon} />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationText}>{ride.sender_location}</Text>
            </View>
          </View>
          
          <View style={styles.locationItem}>
            <View style={[styles.locationIconContainer, styles.destinationIconContainer]}>
              <Image source={icons.pin} style={styles.destinationIcon} />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Destination</Text>
              <Text style={styles.locationText}>{ride.receiver_location}</Text>
            </View>
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
      <Text style={styles.sectionTitle1}>Recent Bookings</Text>
      <FlatList
        data={recent}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <RecentRideItem ride={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 100 , marginTop: 10}}
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
      scrollEnabled={true}
      bounces={false}
      showsVerticalScrollIndicator={false}
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#3737ff"
        />
      }
    >
      <View style={styles.topbar}>
        
      </View>
      <WelcomeHeader userName={user?.emailAddresses[0].emailAddress.split( "6")[0] + "👋"} notificationCount={3} />
      <AdvertBanner
        images={[
          require("@/assets/images/banner1.jpg"),
          require("@/assets/images/banner2.jpg"),
          require("@/assets/images/banner3.png"),
        ]}
        autoScrollInterval={5000} // 7 seconds between slides
      />

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
          label="Coming Soon"
          onPress={() => Alert.alert("Coming Soon", "This feature will be available soon!", [{ text: "OK", style: "default" }])}
          iconAspectRatio={0.98}
        />
      </View>

      {/* Recent Bookings */}
      <RecentBookings rides={bookings} limit={3}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  topbar: {
    backgroundColor: "#3737ff",
    width: "100%",
    height: 35,
    marginTop: -10,
    borderRadius: 10,
  
   


  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    marginTop: 1,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingHorizontal: 1,
    paddingBottom: 10,
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
    fontWeight: 'semibold',
    letterSpacing: -0.5,
    marginLeft:90,
    
  },
  sectionTitle1: {
    fontSize: 18,
    fontFamily: 'JakartaBold',
    color: "#1a1a1a",
    fontWeight: 'semibold',
    letterSpacing: -0.5,
    marginLeft: 120,
    
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 5,
    gap: 12,
  },
  recentContainer: {
    marginTop: 30,
    marginBottom: 100,
  },
  recentRideItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rideIdContainer: {
    flex: 1,
  },
  rideId: {
    fontSize: 15,
    fontFamily: 'JakartaBold',
    color: '#333',
    marginBottom: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginLeft: 8,
  },
  pendingBadge: {
    backgroundColor: '#FF6B00',
  },
  completedBadge: {
    backgroundColor: '#E3F2FD',
  },
  draftBadge: {
    backgroundColor: '#F3E5F5',
  },
  statusText: {
    color: '#333',
    fontSize: 12,
    fontFamily: 'JakartaSemiBold',
  },
  locationContainer: {
    marginTop: 4,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  locationItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  destinationIconContainer: {
    backgroundColor: '#FFF3E0',
  },
  locationIcon: {
    width: 16,
    height: 16,
    tintColor: '#3737FF',
  },
  destinationIcon: {
    width: 14,
    height: 14,
    tintColor: '#FF6B00',
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 11,
    fontFamily: 'JakartaMedium',
    color: '#666',
    marginBottom: 0,
    marginTop: 15,
  },
  locationText: {
    fontSize: 13,
    fontFamily: 'JakartaSemiBold',
    color: '#333',
    lineHeight: 16,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'JakartaRegular',
    color: '#666',
  },
});

export default HOME;

