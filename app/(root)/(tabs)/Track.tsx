import { router } from "expo-router";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image, Platform, Modal, SafeAreaView } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { icons } from "@/constants";
import MapView, { Marker, Polyline } from 'react-native-maps';

interface Shipment {
  id: string;
  title: string;
  status: 'in_transit' | 'scheduled';
  trackingNumber: string;
  estimatedDelivery: string;
  currentLocation: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  currentPosition?: {
    latitude: number;
    longitude: number;
  };
}

interface SectionHeader {
  type: 'header';
  title: string;
}

type ListItem = Shipment | SectionHeader;

// Sample data - replace with your actual data source
const shipments: Shipment[] = [
  {
    id: '1',
    title: 'Electronics Package',
    status: 'in_transit',
    trackingNumber: 'TRK123456',
    estimatedDelivery: '2024-03-25',
    currentLocation: 'Kampala Distribution Center',
    coordinates: {
      latitude: 0.3476,
      longitude: 32.5825
    },
    destination: {
      latitude: 3.0201,
      longitude: 30.9111
    }
  },
  {
    id: '2',
    title: 'Furniture Delivery',
    status: 'scheduled',
    trackingNumber: 'TRK789012',
    estimatedDelivery: '2024-03-28',
    currentLocation: 'Kampala Warehouse',
    coordinates: {
      latitude: 0.3476,
      longitude: 32.5825
    },
    destination: {
      latitude: 3.0201,
      longitude: 30.9111
    }
  },
  {
    id: '3',
    title: 'Food Supplies',
    status: 'in_transit',
    trackingNumber: 'TRK345678',
    estimatedDelivery: '2024-03-26',
    currentLocation: 'Kampala Transit Hub',
    coordinates: {
      latitude: 0.3476,
      longitude: 32.5825
    },
    destination: {
      latitude: 3.0201,
      longitude: 30.9111
    }
  },
  {
    id: '4',
    title: 'Medical Supplies',
    status: 'scheduled',
    trackingNumber: 'TRK901234',
    estimatedDelivery: '2024-03-29',
    currentLocation: 'Kampala Medical Center',
    coordinates: {
      latitude: 0.3476,
      longitude: 32.5825
    },
    destination: {
      latitude: 3.0201,
      longitude: 30.9111
    }
  }
];

interface ShipmentCardProps {
  item: Shipment;
  onPress: (shipment: Shipment) => void;
}

const ShipmentCard: React.FC<ShipmentCardProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
    <View style={styles.cardHeader}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={[
        styles.statusBadge,
        item.status === 'in_transit' ? styles.inTransitBadge : styles.scheduledBadge
      ]}>
        <Text style={styles.statusText}>
          {item.status === 'in_transit' ? 'In Transit' : 'Scheduled'}
        </Text>
      </View>
    </View>
    
    <View style={styles.cardDetails}>
      <View style={styles.detailRow}>
        <Image source={icons.track} style={styles.icon} />
        <Text style={styles.detailText}>Tracking: {item.trackingNumber}</Text>
      </View>
      <View style={styles.detailRow}>
        <Image source={icons.map} style={styles.icon} />
        <Text style={styles.detailText}>Delivery: {item.estimatedDelivery}</Text>
      </View>
      <View style={styles.detailRow}>
        <Image source={icons.map} style={styles.icon} />
        <Text style={styles.detailText}>{item.currentLocation}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const Track: React.FC = () => {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [isTracking, setIsTracking] = useState(false);
  const mapRef = useRef<MapView>(null);
  const trackingInterval = useRef<number | null>(null);
  const currentRouteIndex = useRef<number>(0);

  const fetchRoute = async (origin: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }) => {
    try {
      console.log('Fetching route for:', { origin, destination });
      const response = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${origin.latitude},${origin.longitude}|${destination.latitude},${destination.longitude}&mode=drive&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`
      );
      const data = await response.json();
      console.log('Route API Response:', data);
      
      if (data.features && data.features[0] && data.features[0].geometry.coordinates) {
        // Get the raw coordinates - they come in a nested array format
        const rawCoordinates = data.features[0].geometry.coordinates[0];
        console.log('Raw coordinates:', rawCoordinates);
        
        // Transform the coordinates into the correct format
        const coordinates = rawCoordinates.map((coord: number[]) => ({
          latitude: coord[1],  // Geoapify returns [longitude, latitude]
          longitude: coord[0]
        }));
        
        console.log('Processed coordinates:', coordinates);
        setRouteCoordinates(coordinates);
      } else {
        console.error('No valid route features found in response:', data);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const simulateGPSTracking = (shipment: Shipment) => {
    if (trackingInterval.current) {
      clearInterval(trackingInterval.current);
    }

    currentRouteIndex.current = 0;
    
    trackingInterval.current = setInterval(() => {
      if (currentRouteIndex.current >= routeCoordinates.length - 1) {
        if (trackingInterval.current) {
          clearInterval(trackingInterval.current);
        }
        setIsTracking(false);
        return;
      }

      // Move through multiple points at once for faster movement
      currentRouteIndex.current += 5; // Move 5 points at a time
      if (currentRouteIndex.current >= routeCoordinates.length) {
        currentRouteIndex.current = routeCoordinates.length - 1;
      }
      
      const currentPosition = routeCoordinates[currentRouteIndex.current];

      // Update shipment position
      setSelectedShipment(prev => {
        if (!prev) return null;
        return {
          ...prev,
          currentPosition
        };
      });

      // Center map on current position
      mapRef.current?.animateToRegion({
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        latitudeDelta: 5,
        longitudeDelta: 5,
      });
    }, 50); // Reduced from 100ms to 50ms for faster updates
  };

  const handleShipmentPress = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    fetchRoute(shipment.coordinates, shipment.destination);
  };

  const handleStartTracking = () => {
    if (selectedShipment && routeCoordinates.length > 0) {
      setIsTracking(true);
      simulateGPSTracking(selectedShipment);
    }
  };

  const handleStopTracking = () => {
    if (trackingInterval.current) {
      clearInterval(trackingInterval.current);
    }
    setIsTracking(false);
  };

  const handleCloseMap = () => {
    handleStopTracking();
    setSelectedShipment(null);
    setRouteCoordinates([]);
  };

  useEffect(() => {
    return () => {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
      }
    };
  }, []);

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const inTransitShipments = shipments.filter(s => s.status === 'in_transit');
  const scheduledShipments = shipments.filter(s => s.status === 'scheduled');

  const listData: ListItem[] = [
    { type: 'header', title: 'In Transit' },
    ...inTransitShipments,
    { type: 'header', title: 'Scheduled' },
    ...scheduledShipments
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
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
        <Text style={styles.headerTitle}>Track Shipments</Text>
      </View>
      <View style={styles.container}>
        <FlatList
          data={listData}
          renderItem={({ item }) => {
            if ('type' in item && item.type === 'header') {
              return renderSectionHeader(item.title);
            }
            return <ShipmentCard item={item as Shipment} onPress={handleShipmentPress} />;
          }}
          keyExtractor={(item) => 'type' in item ? item.title : item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />

        <Modal
          visible={selectedShipment !== null}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseMap}
        >
          <View style={styles.modalContainer}>
            <View style={styles.mapContainer}>
              <View style={styles.mapHeader}>
                <TouchableOpacity onPress={handleCloseMap} style={styles.closeButton}>
                  <Image source={icons.close} style={styles.closeIcon} />
                </TouchableOpacity>
                <View style={styles.mapHeaderContent}>
                  <Text style={styles.mapTitle}>{selectedShipment?.title}</Text>
                  <View style={styles.etaContainer}>
                    <Text style={styles.etaText}>
                      ETA: {selectedShipment?.estimatedDelivery}
                    </Text>
                  </View>
                </View>
              </View>
              
              {selectedShipment && (
                <MapView
                  ref={mapRef}
                  style={styles.map}
                  initialRegion={{
                    latitude: 1.6847, // Center between Kampala and Arua
                    longitude: 31.7468,
                    latitudeDelta: 5,
                    longitudeDelta: 5,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: selectedShipment.coordinates.latitude,
                      longitude: selectedShipment.coordinates.longitude,
                    }}
                    title="Kampala"
                    pinColor="blue"
                  />
                  <Marker
                    coordinate={{
                      latitude: selectedShipment.destination.latitude,
                      longitude: selectedShipment.destination.longitude,
                    }}
                    title="Arua"
                    pinColor="green"
                  />
                  {selectedShipment.currentPosition && (
                    <Marker
                      coordinate={selectedShipment.currentPosition}
                      title="Current Position"
                      pinColor="red"
                    />
                  )}
                  {routeCoordinates.length > 0 && (
                    <Polyline
                      coordinates={routeCoordinates}
                      strokeColor="#3737ff"
                      strokeWidth={5}
                      zIndex={1}
                    />
                  )}
                </MapView>
              )}
              <View style={styles.trackingControls}>
                {!isTracking ? (
                  <TouchableOpacity 
                    style={styles.trackingButton} 
                    onPress={handleStartTracking}
                  >
                    <Text style={styles.trackingButtonText}>Start Tracking</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={[styles.trackingButton, styles.stopTrackingButton]} 
                    onPress={handleStopTracking}
                  >
                    <Text style={styles.trackingButtonText}>Stop Tracking</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: "#fff",
    fontFamily: "JakartaBold",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.5,
  
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'JakartaSemiBold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'JakartaSemiBold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  inTransitBadge: {
    backgroundColor: '#E3F2FD',
  },
  scheduledBadge: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'JakartaMedium',
    color: '#333',
  },
  cardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: '#666',
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'JakartaRegular',
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mapHeaderContent: {
    flex: 1,
    marginLeft: 12,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: '#666',
  },
  mapTitle: {
    fontSize: 18,
    fontFamily: 'JakartaSemiBold',
    color: '#333',
    marginBottom: 4,
  },
  etaContainer: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  etaText: {
    fontSize: 14,
    fontFamily: 'JakartaMedium',
    color: '#3737ff',
  },
  map: {
    flex: 1,
  },
  trackingControls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  trackingButton: {
    backgroundColor: '#3737ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  stopTrackingButton: {
    backgroundColor: '#ff3737',
  },
  trackingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'JakartaSemiBold',
  },
});

export default Track;


