
import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { useLocationStore } from "@/store";
import { Ride } from "@/types/type";
import React from "react";
import GeoapifyTextInput from "@/components/GeoapifyTextInput";



const recentRides = [
    {
        "ride_id": "1",
        "origin_address": "Kathmandu, Nepal",
        "destination_address": "Pokhara, Nepal",
        "origin_latitude": "27.717245",
        "origin_longitude": "85.323961",
        "destination_latitude": "28.209583",
        "destination_longitude": "83.985567",
        "ride_time": 391,
        "fare_price": "19500.00",
        "payment_status": "paid",
        "driver_id": 2,
        "user_id": "1",
        "created_at": "2024-08-12 05:19:20.620007",
        "driver": {
            "driver_id": "2",
            "first_name": "David",
            "last_name": "Brown",
            "profile_image_url": "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
            "car_image_url": "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
            "car_seats": 5,
            "rating": "4.60"
        }
    },
    {
        "ride_id": "2",
        "origin_address": "Jalkot, MH",
        "destination_address": "Pune, Maharashtra, India",
        "origin_latitude": "18.609116",
        "origin_longitude": "77.165873",
        "destination_latitude": "18.520430",
        "destination_longitude": "73.856744",
        "ride_time": 491,
        "fare_price": "24500.00",
        "payment_status": "paid",
        "driver_id": 1,
        "user_id": "1",
        "created_at": "2024-08-12 06:12:17.683046",
        "driver": {
            "driver_id": "1",
            "first_name": "James",
            "last_name": "Wilson",
            "profile_image_url": "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
            "car_image_url": "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
            "car_seats": 4,
            "rating": "4.80"
        }
    },
    {
        "ride_id": "3",
        "origin_address": "Zagreb, Croatia",
        "destination_address": "Rijeka, Croatia",
        "origin_latitude": "45.815011",
        "origin_longitude": "15.981919",
        "destination_latitude": "45.327063",
        "destination_longitude": "14.442176",
        "ride_time": 124,
        "fare_price": "6200.00",
        "payment_status": "paid",
        "driver_id": 1,
        "user_id": "1",
        "created_at": "2024-08-12 08:49:01.809053",
        "driver": {
            "driver_id": "1",
            "first_name": "James",
            "last_name": "Wilson",
            "profile_image_url": "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
            "car_image_url": "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
            "car_seats": 4,
            "rating": "4.80"
        }
    },
    {
        "ride_id": "4",
        "origin_address": "Okayama, Japan",
        "destination_address": "Osaka, Japan",
        "origin_latitude": "34.655531",
        "origin_longitude": "133.919795",
        "destination_latitude": "34.693725",
        "destination_longitude": "135.502254",
        "ride_time": 159,
        "fare_price": "7900.00",
        "payment_status": "paid",
        "driver_id": 3,
        "user_id": "1",
        "created_at": "2024-08-12 18:43:54.297838",
        "driver": {
            "driver_id": "3",
            "first_name": "Michael",
            "last_name": "Johnson",
            "profile_image_url": "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
            "car_image_url": "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
            "car_seats": 4,
            "rating": "4.70"
        }
    }
]

const Home = () => {
  const { user } = useUser();
  // const { signOut } = useAuth();

  const { setUserLocation, setDestinationLocation } = useLocationStore();

  const handleSignOut = () => {
    // signOut();
    // router.replace("/(auth)/sign-in");
  };

  const [hasPermission, setHasPermission] = useState<boolean>(false);

//   const {
//     data: recentRides,
//     loading,
//     error,
// }
// = useFetch<Ride[]>(`/(api)/ride/${user?.id}`);

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({}); 

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      setUserLocation({
        // latitude: location.coords?.latitude!,
        // longitude: location.coords?.longitude!,
        latitude: 37.78825,
        longitude: -122.4324,
        address: `${address[0].name}, ${address[0].region}`,
      });
    };   requestLocation();
  }, []);

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);

    router.push("/(root)/find-ride");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        // keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  style={styles.noResultImage}
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text style={styles.noResultText}>No recent rides found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <>
            <View style={styles.headerContainer}>
              <Text style={styles.welcomeText}>
                Welcome {user?.emailAddresses[0].emailAddress.split( "6")[0]} {""}👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                style={styles.signOutButton}
              >
                <Image source={icons.out} style={styles.signOutIcon} />
              </TouchableOpacity>
      </View>

            <GeoapifyTextInput
              icon={icons.search}
              containerStyle ={styles.searchInputContainer}
              handlePress={handleDestinationPress}
            />

            <>
              <Text style={styles.currentLocationText}>
                Your current location
              </Text>
              <View style={styles.mapContainer}>
                <Map />
      </View>
            </>

            <Text style={styles.recentRidesText}>Recent Rides</Text>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default Home;

// Styles
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#f3f4f6", // bg-general-500 equivalent
  },
  flatListContent: {
    paddingHorizontal: 20, // px-5 equivalent
    paddingBottom: 100,
  },
  emptyContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  noResultImage: {
    width: 160, // w-40 equivalent
    height: 160, // h-40 equivalent
  },
  noResultText: {
    fontSize: 14, // text-sm equivalent
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20, // my-5 equivalent
  },
  welcomeText: {
    fontSize: 24, // text-2xl equivalent
    fontFamily: "JakartaExtraBold",
  },
  signOutButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40, // w-10 equivalent
    height: 40, // h-10 equivalent
    borderRadius: 999, // rounded-full equivalent
    backgroundColor: "white",
  },
  signOutIcon: {
    width: 16, // w-4 equivalent
    height: 16, // h-4 equivalent
  },
  searchInputContainer: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 9, // For Android
    borderColor : "#000",
  },
  currentLocationText: {
    fontSize: 20, // text-xl equivalent
    fontFamily: "JakartaBold",
    marginTop: 20, // mt-5 equivalent
    marginBottom: 12, // mb-3 equivalent
  },
  mapContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    height: 300, // h-[300px] equivalent
  },
  recentRidesText: {
    fontSize: 20, // text-xl equivalent
    fontFamily: "JakartaBold",
    marginTop: 20, // mt-5 equivalent
    marginBottom: 12, // mb-3 equivalent
  },
});