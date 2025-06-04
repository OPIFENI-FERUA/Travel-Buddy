import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";


const Map = ({ routeData }: { routeData: {
  origin: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
} | null }) => {
  const initialRegion = {
    latitude: 1.3733, // Uganda center
    longitude: 32.2903,
    latitudeDelta: 1.0, // Adjust the zoom level
    longitudeDelta: 1.0, // Adjust the zoom level
  };

  if (Platform.OS === "web") {
    return (
      <View style={styles.webFallback}>
        <Text style={{ color: "#555" }}>Map view is not supported on web.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          userInterfaceStyle="dark"
        >
          {routeData && (
            <>
              <Marker
                coordinate={routeData.origin}
                title="Goods Origin"
                description="Kampala"
              />
              <Marker
                coordinate={routeData.destination}
                title="Goods Destination"
                description="Arua"
              />
              <Polyline
                coordinates={[routeData.origin, routeData.destination]}
                strokeColor="#FF0000"
                strokeWidth={3}
              />
            </>
          )}
        </MapView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    padding: 10,
    backgroundColor: "#fff",
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  webFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
