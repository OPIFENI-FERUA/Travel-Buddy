import React, { useState } from "react";
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

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "How does the tracking system work?",
      answer: "Our tracking system uses GPS technology to provide real-time location updates of your delivery. The app shows the current location of your package, estimated arrival time, and delivery status updates."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept various payment methods through Flutterwave, including credit/debit cards, mobile money (MTN, Airtel), and bank transfers. All payments are secure and encrypted."
    },
    {
      question: "How accurate is the delivery time estimate?",
      answer: "Delivery time estimates are based on real-time traffic conditions, distance, and historical delivery data. While we strive for accuracy, factors like weather and road conditions may affect the actual delivery time."
    },
    {
      question: "Can I track multiple deliveries at once?",
      answer: "Yes, you can track multiple deliveries simultaneously. Each delivery will have its own tracking number and status updates in your tracking history."
    },
    {
      question: "What happens if my delivery is delayed?",
      answer: "If your delivery is delayed, you'll receive a notification through the app. Our customer service team will keep you updated on the new estimated delivery time and the reason for the delay."
    },
    {
      question: "How do I report a problem with my delivery?",
      answer: "You can report issues through the app's 'Help & Support' section or contact our customer service team directly. We aim to respond to all queries within 24 hours."
    },
    {
      question: "Is my location data secure?",
      answer: "Yes, we take data security seriously. All location data is encrypted and stored securely. We only use this information for delivery tracking purposes and never share it with third parties without your consent."
    },
    {
      question: "What areas do you service?",
      answer: "We currently service major cities and towns across Uganda, including Kampala, Entebbe, Jinja, and Arua. We're continuously expanding our service areas."
    },
    {
      question: "How do I update my delivery address?",
      answer: "You can update your delivery address in the app's settings or contact our customer service team. Please note that address changes may affect delivery time estimates."
    },
    {
      question: "What if I'm not available to receive my delivery?",
      answer: "If you're not available, our delivery partner will attempt to contact you. You can also specify alternative delivery instructions or a preferred delivery time window in the app."
    }
  ];

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
      </View>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {faqs.map((faq, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            onPress={() => toggleFAQ(index)}
            activeOpacity={0.7}
          >
            <View style={styles.questionContainer}>
              <Text style={styles.question}>{faq.question}</Text>
              <Image
                source={icons.arrowDown}
                style={[
                  styles.arrowIcon,
                  expandedIndex === index && styles.arrowIconRotated
                ]}
              />
            </View>
            {expandedIndex === index && (
              <Text style={styles.answer}>{faq.answer}</Text>
            )}
          </TouchableOpacity>
        ))}
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
  faqItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 16,
    fontFamily: "JakartaSemiBold",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  answer: {
    fontSize: 14,
    fontFamily: "JakartaRegular",
    color: "#666",
    marginTop: 12,
    lineHeight: 20,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: "#3737ff",
  },
  arrowIconRotated: {
    transform: [{ rotate: "180deg" }],
  },
});

export default FAQ; 