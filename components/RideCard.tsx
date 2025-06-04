import { Image, Text, View, StyleSheet } from "react-native";
import { icons } from "@/constants";
import { formatDate, formatTime } from "@/lib/utils";
import { Ride } from "@/types/type";
import React from "react";

const RideCard = ({
  ride: {
    destination_longitude,
    destination_latitude,
    origin_address,
    destination_address,
    created_at,
    driver,
    payment_status,
    ride_time,
  },
}: { ride: Ride }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <View style={styles.mapAndAddressContainer}>
          <Image
            source={{
              uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${destination_longitude},${destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
            }}
            style={styles.mapImage}
          />

          <View style={styles.addressContainer}>
            <View style={styles.addressRow}>
              <Image source={icons.to} style={styles.addressIcon} />
              <Text style={styles.addressText} numberOfLines={1}>
                {origin_address}
              </Text>
            </View>

            <View style={styles.addressRow}>
              <Image source={icons.point} style={styles.addressIcon} />
              <Text style={styles.addressText} numberOfLines={1}>
                {destination_address}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {formatDate(created_at)}, {formatTime(ride_time)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Driver</Text>
            <Text style={styles.detailValue}>
              {driver.first_name} {driver.last_name}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Car Seats</Text>
            <Text style={styles.detailValue}>{driver.car_seats}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Status</Text>
            <Text
              style={[
                styles.detailValue,
                payment_status === "paid"
                  ? styles.paymentStatusPaid
                  : styles.paymentStatusUnpaid,
              ]}
            >
              {payment_status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RideCard;

// Styles
const styles = StyleSheet.create({
  cardContainer: {
    width: "100%", // Take the full width of the parent
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // For Android
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 12,
    width: "100%", // Ensure content takes full width
  },
  mapAndAddressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%", // Ensure this container takes full width
  },
  mapImage: {
    width: 80,
    height: 90,
    borderRadius: 8,
  },
  addressContainer: {
    flexDirection: "column",
    marginLeft: 20,
    gap: 20,
    flex: 1,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addressIcon: {
    width: 20,
    height: 20,
  },
  addressText: {
    fontSize: 16,
    fontFamily: "JakartaMedium",
  },
  detailsContainer: {
    flexDirection: "column",
    width: "100%",
    marginTop: 20,
    backgroundColor: "#f3f4f6", // bg-general-500 equivalent
    borderRadius: 8,
    padding: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: "JakartaMedium",
    color: "#6b7280", // text-gray-500 equivalent
  },
  detailValue: {
    fontSize: 16,
    fontFamily: "JakartaBold",
  },
  paymentStatusPaid: {
    color: "#22c55e", // text-green-500 equivalent
  },
  paymentStatusUnpaid: {
    color: "#ef4444", // text-red-500 equivalent
  },
});