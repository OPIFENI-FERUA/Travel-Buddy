import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet, TextInput, Button } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Map from "@/components/Map";
import { icons } from "@/constants";

const RideLayout = ({
  title,
  snapPoints,
  children,
}: {
  title: string;
  snapPoints?: string[];
  children: React.ReactNode;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [goodsId, setGoodsId] = useState("");
  const [timeLeft, setTimeLeft] = useState("2 hours"); // Example time left
  const [busInfo, setBusInfo] = useState("Bus 123 - ABC Transport"); // Example bus info
  const [routeData, setRouteData] = useState<{
    origin: { latitude: number; longitude: number };
    destination: { latitude: number; longitude: number };
  } | null>(null);

  const handleTrackGoods = () => {
    if (!goodsId.trim()) return;

    // Simulate backend data for demo
    setRouteData({
      origin: { latitude: 0.3476, longitude: 32.5825 }, // Kampala
      destination: { latitude: 3.0191, longitude: 30.9300 }, // Arua
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <View style={styles.backButton}>
                <Image source={icons.backArrow} resizeMode="contain" style={styles.backIcon} />
              </View>
            </TouchableOpacity>
            <Text style={styles.title}>{title || "Go Back"}</Text>
          </View>
          <Map routeData={routeData} />
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints || ["50%", "50%"]}
          index={1}
        >
          <BottomSheetView style={styles.sheetContent}>
          <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter Goods ID"
          value={goodsId}
          onChangeText={setGoodsId}
          style={styles.input}
        />
        <Button title="Track Goods" onPress={handleTrackGoods} />
      </View>
            <Text style={styles.infoText}>Time Left: {timeLeft}</Text>
            <Text style={styles.infoText}>Bus Info: {busInfo}</Text>
            {children}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "#3B82F6", // Tailwind bg-blue-500 equivalent
  },
  headerContainer: {
    flexDirection: "row",
    position: "absolute",
    zIndex: 10,
    top: 64, // Equivalent to Tailwind's top-16
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: "JakartaSemiBold",
    marginLeft: 20,
  },
  sheetContent: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  inputContainer: {
    padding: 10,
    backgroundColor: "#fff",
    zIndex: 1,
  },
});

export default RideLayout;