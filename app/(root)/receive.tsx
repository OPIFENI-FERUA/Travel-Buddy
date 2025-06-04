// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   Alert,
//   Image,
//   NetInfo,
// } from "react-native";
// import { icons } from "@/constants";
// import { useNavigation } from "@react-navigation/native";
// import { useAuth, useUser } from "@clerk/clerk-expo";
// import { fetchAPI } from "@/lib/fetch";
// import { Svg, Rect, Path } from 'react-native-svg';

// interface Package {
//   id: string;
//   packageId: string;
//   sender_name: string;
//   sender_location: string;
//   sender_mobile: string;
//   receiver_name: string;
//   receiver_location: string;
//   receiver_mobile: string;
//   package_type: string;
//   weight: string;
//   created_at: string;
//   status: string;
//   description: string;
//   is_fragile: boolean;
//   is_tracking: boolean;
// }

// const QRCode = ({ value, size = 200 }: { value: string; size?: number }) => {
//   // Simple QR code implementation using SVG
//   return (
//     <Svg width={size} height={size} viewBox="0 0 200 200">
//       <Rect width="200" height="200" fill="white" />
//       <Path
//         d="M20 20h40v40H20zM140 20h40v40h-40zM20 140h40v40H20zM140 140h40v40h-40z"
//         fill="black"
//       />
//       <Text x="100" y="100" textAnchor="middle" fill="black">
//         {value}
//       </Text>
//     </Svg>
//   );
// };

// const PackageItem = ({
//   packageId,
//   sender,
//   description,
//   weight,
//   deliveryTime,
//   instructions,
//   qrData,
// }: {
//   packageId: string;
//   sender: string;
//   description: string;
//   weight: string;
//   deliveryTime: string;
//   instructions: string;
//   qrData: string;
// }) => (
//   <View style={styles.packageItem}>
//     <View style={styles.packageHeader}>
//       <Text style={styles.packageId}>{packageId}</Text>
//       <Text style={styles.status}>Pending</Text>
//     </View>
    
//     <View style={styles.qrContainer}>
//       <QRCode value={qrData} />
//     </View>

//     <View style={styles.detailsContainer}>
//       <Text style={styles.sectionTitle}>Sender Details</Text>
//       <Text style={styles.detailText}>Name: {sender}</Text>
//       <Text style={styles.detailText}>Mobile: {sender}</Text>
      
//       <Text style={styles.sectionTitle}>Package Details</Text>
//       <Text style={styles.detailText}>Type: {description}</Text>
//       <Text style={styles.detailText}>Weight: {weight}</Text>
//       <Text style={styles.detailText}>Instructions: {instructions}</Text>
//       <Text style={styles.detailText}>Delivery Time: {deliveryTime}</Text>
//     </View>
//   </View>
// );

// const ReceivePackageScreen = () => {
//   const [packages, setPackages] = useState<Package[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isConnected, setIsConnected] = useState<boolean | null>(null);
//   const { user } = useUser();
//   const navigation = useNavigation();

//   useEffect(() => {
//     const checkConnection = async () => {
//       try {
//         const netInfo = await NetInfo.fetch();
//         setIsConnected(netInfo.isConnected);
//       } catch (err) {
//         console.error("Error checking connection:", err);
//         setIsConnected(false);
//       }
//     };

//     checkConnection();
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setIsConnected(state.isConnected);
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   const fetchPackages = async () => {
//     if (!user) {
//       setError("User not authenticated");
//       return;
//     }

//     if (!isConnected) {
//       setError("No internet connection");
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await fetchAPI(`/(api)/booking?clerkId=${user.id}`);
      
//       if (!response) {
//         throw new Error("No response from server");
//       }
      
//       if (response.success && response.bookings) {
//         setPackages(response.bookings);
//       } else {
//         throw new Error(response.error || "Failed to load packages");
//       }
//     } catch (err) {
//       console.error("Error fetching packages:", err);
//       setError(err instanceof Error ? err.message : "Failed to load packages");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isConnected !== null) {
//       fetchPackages();
//     }
//   }, [user, isConnected]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text style={styles.loadingText}>Loading packages...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity 
//           style={styles.retryButton}
//           onPress={fetchPackages}
//         >
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Package QR Codes</Text>
      
//       <FlatList
//         data={packages}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <PackageItem
//             packageId={item.packageId}
//             sender={item.sender_name}
//             description={item.description}
//             weight={item.weight}
//             deliveryTime={new Date(item.created_at).toLocaleTimeString()}
//             instructions={item.package_type}
//             qrData={JSON.stringify({
//               id: item.id,
//               packageId: item.packageId,
//               sender: item.sender_name,
//               receiver: item.receiver_name,
//               status: item.status
//             })}
//           />
//         )}
//         contentContainerStyle={styles.packageList}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No packages found</Text>
//           </View>
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontFamily: "JakartaBold",
//     color: "#333",
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   packageList: {
//     paddingBottom: 16,
//   },
//   packageItem: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   packageHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   packageId: {
//     fontSize: 16,
//     fontFamily: 'JakartaBold',
//     color: '#333',
//   },
//   status: {
//     color: '#e67e22',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   qrContainer: {
//     alignItems: 'center',
//     marginVertical: 20,
//     padding: 10,
//     backgroundColor: 'white',
//     borderRadius: 8,
//   },
//   detailsContainer: {
//     marginTop: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontFamily: 'JakartaBold',
//     color: '#333',
//     marginTop: 12,
//     marginBottom: 8,
//   },
//   detailText: {
//     fontSize: 14,
//     fontFamily: 'JakartaRegular',
//     color: '#555',
//     marginBottom: 4,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//   },
//   loadingText: {
//     fontSize: 16,
//     color: '#666',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   errorText: {
//     color: '#e74c3c',
//     fontSize: 16,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   retryButton: {
//     backgroundColor: '#2980b9',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   retryButtonText: {
//     color: '#ecf0f1',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#7f8c8d',
//     textAlign: 'center',
//   },
// });

// export default ReceivePackageScreen;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QrScreen = () => {
  const qrData = "https://yourwebsite.com"; // you can change this!

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your QR Code</Text>
      <View style={styles.qrContainer}>
        <Text>QR Code</Text>
  
      </View>
    </View>
  );
};

export default QrScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 5, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
