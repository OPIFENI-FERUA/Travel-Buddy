import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth, useUser } from "@clerk/clerk-expo";

import ProfileMenuItem from "@/components/ProfileMenuItem";
import ProfileIcon from "@/components/ProfileIcon";
// import { fetchUserData } from "@/lib/fetch";


const Profile = () => {
  const router = useRouter();
  const { signOut, isSignedIn} = useAuth();
  const { user } = useUser();
  const [profileImage, setProfileImage] = useState(
    require("@/assets/images/image1.jpg")
  );
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from database
  // useEffect(() => {
  //   const getUserData = async () => {
  //     try {
  //       setIsLoading(true);
  //       if (isSignedIn && user) {
  //         // Set profile image from Clerk
  //         if (profileImage) {
  //           setProfileImage(profileImage);
  //         }

  //         // Fetch user data from our database
  //         const userData = await fetchUserData(
  //           user.primaryEmailAddress?.emailAddress,
  //         );
  //         if (userData && userData.name) {
  //           setUserName(userData.name);
  //         } else if (user.fullName) {
  //           // Fallback to Clerk data if database fetch fails
  //           setUserName(user.fullName);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //       // Fallback to Clerk data if there's an error
  //       if (user?.fullName) {
  //         setUserName(user.fullName);
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   getUserData();
  // }, [isSignedIn, user]);

  const handleViewProfile = () => {
    // Navigate to detailed profile view or edit profile
    router.push("/(root)/Profile-content");
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              router.replace("/(auth)/welcome");
            } catch (error) {
              console.error("Error signing out:", error);
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          },
        },
      ],
      { cancelable: true },
    );
  };



  const navigateToNotifications = () => {
    // Navigate to notifications screen
    Alert.alert("Notifications", "Navigate to notifications screen");
  };

  const navigateToTerms = () => {
    router.push("/(root)/terms");
  };

  const navigateToPrivacy = () => {
    router.push("/(root)/privacy");
  };

  const navigateToFAQ = () => {
    router.push("/(root)/faq");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={handleViewProfile} activeOpacity={0.8}>
            <View style={styles.headerContainer}>
              <View style={styles.headerContent}>
                <Text style={styles.accountTitle}>Account</Text>
                <View style={styles.profileImageContainer}>
                  <Image
                    source={user?.imageUrl ? { uri: user.imageUrl } : profileImage}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.userName}>
                  {user?.emailAddresses[0].emailAddress.split("6")[0]} {""}
                </Text>
                <View style={styles.viewProfileContainer}>
                  <Text style={styles.viewProfileText}>View Profile</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.menuContainer}>
            <View style={styles.menuContent}>
              <ProfileMenuItem
                icon={<ProfileIcon name="wallet" />}
                title="Wallet"
                description="Your transactions"
                onPress={() => router.push("/Wallet")}
              />

              <ProfileMenuItem
                icon={<ProfileIcon name="notifications" />}
                title="Notifications"
                description="Your Notifications"
                onPress={navigateToNotifications}
              />

              <ProfileMenuItem
                icon={<ProfileIcon name="terms" />}
                title="Terms & Conditions"
                description="Know our terms"
                onPress={navigateToTerms}
              />

              <ProfileMenuItem
                icon={<ProfileIcon name="privacy" />}
                title="Privacy Policy"
                description="Our privacy guidlines"
                onPress={navigateToPrivacy}
              />

              <ProfileMenuItem
                icon={<ProfileIcon name="faq" />}
                title="FAQs"
                description="Your answers"
                onPress={navigateToFAQ}
              />

              <ProfileMenuItem
                icon={<ProfileIcon name="logout" />}
                title="Logout"
                description="Signout from your account"
                onPress={handleLogout}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  profileContainer: {
    position: "relative",
    width: "100%",
    maxWidth: 440,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 26,
  },
  headerContainer: {
    width: "100%",
    height: 280,
    backgroundColor: "#3737FF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 20,
  },
  accountTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: -0.92,
    marginBottom: 3,
    fontFamily: "JakartaRegular",
    textAlign: "center",
  },
  profileImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 9999,
    overflow: "hidden",
    backgroundColor: "#FFFFFF20",
    borderWidth: 3,
    borderColor: "#FFFFFF40",
    marginBottom: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: -0.92,
    fontFamily: "JakartaBold",
    marginBottom: 4,
  },
  viewProfileContainer: {
    backgroundColor: "#FFFFFF20",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 2,
  },
  viewProfileText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: -0.6,
    fontFamily: "JakartaMedium",
  },
  menuContainer: {
    width: "100%",
    backgroundColor: "#FDFDFD",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  menuContent: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
});

export default Profile;
