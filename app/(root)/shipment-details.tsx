import { useLocalSearchParams, Stack } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import React from "react";
import { icons } from "@/constants";

// This would typically come from your API or data store
const getShipmentDetails = (id: string) => ({
  id,
  title: 'Electronics Package',
  status: 'in_transit',
  trackingNumber: 'TRK123456',
  estimatedDelivery: '2024-03-25',
  currentLocation: 'Lagos Distribution Center',
  origin: 'Lagos Warehouse',
  destination: 'Abuja Distribution Center',
  timeline: [
    {
      date: '2024-03-20 09:00',
      status: 'Package picked up',
      location: 'Lagos Warehouse'
    },
    {
      date: '2024-03-21 14:30',
      status: 'In transit',
      location: 'Lagos Distribution Center'
    },
    {
      date: '2024-03-22 11:15',
      status: 'Arrived at sorting facility',
      location: 'Ibadan Transit Hub'
    }
  ]
});

const ShipmentDetails = () => {
  const { id } = useLocalSearchParams();
  const shipment = getShipmentDetails(id as string);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Shipment Details",
          headerShown: true,
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{shipment.title}</Text>
          <View style={[
            styles.statusBadge,
            shipment.status === 'in_transit' ? styles.inTransitBadge : styles.scheduledBadge
          ]}>
            <Text style={styles.statusText}>
              {shipment.status === 'in_transit' ? 'In Transit' : 'Scheduled'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tracking Information</Text>
          <View style={styles.infoRow}>
            <Image source={icons.track} style={styles.icon} />
            <Text style={styles.infoText}>Tracking Number: {shipment.trackingNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Image source={icons.map} style={styles.icon} />
            <Text style={styles.infoText}>Estimated Delivery: {shipment.estimatedDelivery}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route Information</Text>
          <View style={styles.routeContainer}>
            <View style={styles.routePoint}>
              <View style={styles.routeDot} />
              <Text style={styles.routeText}>{shipment.origin}</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, styles.routeDotActive]} />
              <Text style={styles.routeText}>{shipment.currentLocation}</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <View style={styles.routeDot} />
              <Text style={styles.routeText}>{shipment.destination}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tracking Timeline</Text>
          {shipment.timeline.map((event, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineDate}>{event.date}</Text>
                <Text style={styles.timelineStatus}>{event.status}</Text>
                <Text style={styles.timelineLocation}>{event.location}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontFamily: 'JakartaSemiBold',
    color: '#333',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
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
    fontSize: 14,
    fontFamily: 'JakartaMedium',
    color: '#333',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'JakartaSemiBold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#666',
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'JakartaRegular',
    color: '#666',
  },
  routeContainer: {
    paddingVertical: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ddd',
    marginRight: 12,
  },
  routeDotActive: {
    backgroundColor: '#3737ff',
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: '#ddd',
    marginLeft: 5,
    marginBottom: 8,
  },
  routeText: {
    fontSize: 16,
    fontFamily: 'JakartaRegular',
    color: '#666',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3737ff',
    marginRight: 12,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    fontSize: 14,
    fontFamily: 'JakartaMedium',
    color: '#333',
    marginBottom: 4,
  },
  timelineStatus: {
    fontSize: 16,
    fontFamily: 'JakartaSemiBold',
    color: '#333',
    marginBottom: 4,
  },
  timelineLocation: {
    fontSize: 14,
    fontFamily: 'JakartaRegular',
    color: '#666',
  },
});

export default ShipmentDetails; 