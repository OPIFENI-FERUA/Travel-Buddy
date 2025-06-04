import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { icons } from "@/constants";

const Terms = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
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
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By accessing and using the Buddy delivery tracking application, you agree to be bound by these Terms and Conditions.
        </Text>

        <Text style={styles.sectionTitle}>2. Service Description</Text>
        <Text style={styles.text}>
          Buddy provides real-time tracking services for deliveries across Uganda. Our service includes GPS tracking, delivery status updates, and estimated arrival times.
        </Text>

        <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
        <Text style={styles.text}>
          • Provide accurate delivery information{'\n'}
          • Maintain the security of your account{'\n'}
          • Report any issues or discrepancies promptly{'\n'}
          • Comply with all applicable laws and regulations
        </Text>

        <Text style={styles.sectionTitle}>4. Privacy and Data</Text>
        <Text style={styles.text}>
          We collect and process location data to provide tracking services. Your data is handled in accordance with our Privacy Policy.
        </Text>

        <Text style={styles.sectionTitle}>5. Service Limitations</Text>
        <Text style={styles.text}>
          • GPS accuracy may vary based on location and device{'\n'}
          • Service availability depends on network connectivity{'\n'}
          • Real-time updates may have slight delays
        </Text>

        <Text style={styles.sectionTitle}>6. Payment Terms</Text>
        <Text style={styles.text}>
          • All fees are payable in advance{'\n'}
          • Refunds are subject to our refund policy{'\n'}
          • We use Flutterwave for secure payment processing
        </Text>

        <Text style={styles.sectionTitle}>7. Termination</Text>
        <Text style={styles.text}>
          We reserve the right to terminate or suspend service for violations of these terms or for any other reason at our discretion.
        </Text>

        <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
        <Text style={styles.text}>
          We may modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.
        </Text>

        <Text style={styles.sectionTitle}>9. Contact</Text>
        <Text style={styles.text}>
          For questions about these terms, please contact us at support@buddy.ug
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "JakartaSemiBold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontFamily: "JakartaRegular",
    color: "#666",
    lineHeight: 24,
    marginBottom: 10,
  },
});

export default Terms; 