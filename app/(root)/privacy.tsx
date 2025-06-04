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

const Privacy = () => {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.text}>
          We collect the following types of information:{'\n\n'}
          • Personal Information: Name, email, phone number{'\n'}
          • Location Data: GPS coordinates for delivery tracking{'\n'}
          • Device Information: Device type, operating system{'\n'}
          • Usage Data: App interaction patterns and preferences
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.text}>
          • Provide and improve our delivery tracking services{'\n'}
          • Send notifications about delivery status{'\n'}
          • Process payments and maintain your account{'\n'}
          • Analyze app usage to enhance user experience{'\n'}
          • Communicate with you about our services
        </Text>

        <Text style={styles.sectionTitle}>3. Data Storage and Security</Text>
        <Text style={styles.text}>
          • We use industry-standard security measures to protect your data{'\n'}
          • Data is stored on secure servers in Uganda{'\n'}
          • We regularly update our security protocols{'\n'}
          • Access to personal data is strictly controlled
        </Text>

        <Text style={styles.sectionTitle}>4. Data Sharing</Text>
        <Text style={styles.text}>
          We may share your information with:{'\n\n'}
          • Delivery partners for service fulfillment{'\n'}
          • Payment processors (Flutterwave) for transactions{'\n'}
          • Service providers who assist in app operations{'\n\n'}
          We do not sell your personal information to third parties.
        </Text>

        <Text style={styles.sectionTitle}>5. Your Rights</Text>
        <Text style={styles.text}>
          You have the right to:{'\n\n'}
          • Access your personal data{'\n'}
          • Correct inaccurate data{'\n'}
          • Request deletion of your data{'\n'}
          • Opt-out of marketing communications{'\n'}
          • Export your data
        </Text>

        <Text style={styles.sectionTitle}>6. Cookies and Tracking</Text>
        <Text style={styles.text}>
          We use cookies and similar technologies to:{'\n\n'}
          • Remember your preferences{'\n'}
          • Analyze app usage{'\n'}
          • Improve our services{'\n'}
          • Provide personalized content
        </Text>

        <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
        <Text style={styles.text}>
          Our services are not intended for users under 13 years of age. We do not knowingly collect personal information from children.
        </Text>

        <Text style={styles.sectionTitle}>8. Changes to Privacy Policy</Text>
        <Text style={styles.text}>
          We may update this privacy policy periodically. We will notify you of any significant changes through the app or via email.
        </Text>

        <Text style={styles.sectionTitle}>9. Contact Us</Text>
        <Text style={styles.text}>
          For privacy-related questions or concerns, please contact us at:{'\n\n'}
          Email: privacy@buddy.ug{'\n'}
          Phone: +256 XXX XXX XXX{'\n'}
          Address: Kampala, Uganda
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

export default Privacy; 