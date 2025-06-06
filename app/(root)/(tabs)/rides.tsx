import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { router } from "expo-router";
import { icons } from "@/constants";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { fetchAPI } from "@/lib/fetch";

// Filter tab component
const FilterTab = ({ 
  title, 
  isActive, 
  onPress 
}: { 
  title: string;
  isActive: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[
      styles.filterTab,
      isActive && (
        title === "Pending" 
          ? styles.pendingTab 
          : title === "Completed" 
            ? styles.completedTab 
            : title === "Drafts"
              ? styles.draftsTab
              : styles.allTab
      )
    ]}
    onPress={onPress}
  >
    <Text 
      style={[
        styles.filterTabText,
        isActive && styles.activeFilterText
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

// Ride item component
const RideItem = ({
  rideId,
  pickup,
  destination,
  date,
  status
}: {
  rideId: string;
  pickup: string;
  destination: string;
  date: string;
  status: "pending" | "complete" | "draft";
}) => (
  <TouchableOpacity
    style={styles.rideItem}
    onPress={() => {
      if (status === "pending") {
        router.push('/pending');
      }
    }}
  >
    <View style={styles.rideHeader}>
      <View style={styles.rideIdContainer}>
        <Text style={styles.rideId}>{rideId}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      <View style={[
        styles.statusBadge,
        status === "pending" ? styles.pendingBadge : 
        status === "complete" ? styles.completedBadge : styles.draftBadge
      ]}>
        <Text style={styles.statusText}>
          {status === "pending" ? "Pending" : 
           status === "complete" ? "Complete" : "Cancelled"}
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
            <Text style={styles.locationText}>{pickup}</Text>
          </View>
        </View>
        
        <View style={styles.locationItem}>
          <View style={[styles.locationIconContainer, styles.destinationIconContainer]}>
            <Image source={icons.pin} style={styles.destinationIcon} />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Destination</Text>
            <Text style={styles.locationText}>{destination}</Text>
          </View>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const RidesScreen = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "complete" | "pending" | "draft">("all");
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { userId } = useAuth();
  const { user } = useUser();

  // Fetch rides from database
  const fetchRides = async () => {
    if (!user) {
      console.log("No userId available");
      return;
    }
    
    try {
      console.log("Starting to fetch rides for userId:", userId);
      setLoading(true);
      const response = await fetchAPI(`/(api)/booking?clerkId=${user.id}`);
      console.log("API Response:", response);
      
      if (response.success && response.bookings) {
        console.log("Number of bookings received:", response.bookings.length);
        console.log("Raw bookings data:", response.bookings);
        
        // Transform the bookings data to match the Ride type
        const transformedRides = response.bookings.map((booking: any) => {
          const transformed = {
            id: booking.id.toString(),
            rideId: `#BKD${booking.id.toString().padStart(6, '0')}`,
            pickup: booking.sender_location,
            destination: booking.receiver_location,
            date: new Date(booking.created_at).toLocaleDateString(),
            status: booking.status || 'draft'
          };
          console.log("Transformed booking:", transformed);
          return transformed;
        });
        
        console.log("Final transformed rides:", transformedRides);
        setRides(transformedRides);
      } else {
        console.log("No bookings found in response");
      }
    } catch (err: any) {
      console.error("Error fetching rides:", err);
      console.log("Error details:", {
        message: err?.message || 'Unknown error',
        stack: err?.stack || 'No stack trace'
      });
      setError("Failed to load rides");
    } finally {
      console.log("Fetch completed, setting loading to false");
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRides();
  }, [userId]);

  // Handle refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchRides();
  }, [userId]);
  
  // Filter rides based on active filter
  const filteredRides = rides.filter(ride => {
    if (activeFilter === "all") return true;
    return ride.status === activeFilter;
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3737ff" />
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
        <Text style={styles.title}>My Bookings</Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersScrollContainer}
      >
        <View style={styles.filterContainer}>
          <FilterTab 
            title="All" 
            isActive={activeFilter === "all"}
            onPress={() => setActiveFilter("all")}
          />
          <FilterTab 
            title="Completed" 
            isActive={activeFilter === "complete"}
            onPress={() => setActiveFilter("complete")}
          />
          <FilterTab 
            title="Pending" 
            isActive={activeFilter === "pending"}
            onPress={() => setActiveFilter("pending")}
          />

        </View>
      </ScrollView>

      {/* Rides List */}
      <FlatList
        data={filteredRides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RideItem
            rideId={item.rideId.substring(0, 12)}
            pickup={item.pickup}
            destination={item.destination}
            date={item.date}
            status={item.status}
          />
        )}
        contentContainerStyle={[
          styles.ridesList,
          activeFilter !== "all" && styles.activeRidesList,
          activeFilter === "complete" && { marginTop: 0 }
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bookings found</Text>
          </View>
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  title: {
    color: "#fff",
    fontFamily: "JakartaBold",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  filtersScrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "transparent",
    width: "100%",
    height: 90
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    // backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginHorizontal: 16,
    marginLeft: 30,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 8,
    height: 50,
    marginBottom: 20,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    width: '40%',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 2,
    alignItems: 'center',
  },
  allTab: {
    backgroundColor: '#f0f0f0',
  },
  completedTab: {
    backgroundColor: '#3737ff',
  },
  pendingTab: {
    backgroundColor: '#FF6B00',
  },
  draftsTab: {
    backgroundColor: '#8e44ad',
  },
  filterTabText: {
    fontSize: 12,
    fontFamily: 'Jakarta-Bold',
    color: '#000',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  ridesList: {
    padding: 16,
    flexGrow: 1,
    paddingBottom: 90,
  },
  activeRidesList: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rideItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 1,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default RidesScreen;