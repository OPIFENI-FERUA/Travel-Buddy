import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WelcomeHeaderProps {
  userName: string;
  notificationCount?: number;
}

const getTimeBasedGreeting = (): string => {

  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
};

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  userName,
  notificationCount = 0,
}) => {
  const [greeting, setGreeting] = React.useState(getTimeBasedGreeting());

  React.useEffect(() => {
    // Update greeting immediately and then every minute
    const updateGreeting = () => {
      setGreeting(getTimeBasedGreeting());
    };

    // Set up interval to update greeting every minute
    const intervalId = setInterval(updateGreeting, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>Welcome {userName}</Text>
        </View>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>{greeting}</Text>
        </View>
      </View>
      <View style={styles.notificationContainer}>
        <Ionicons name="notifications" size={24} color="#000" />
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notificationCount > 99 ? '99+' : notificationCount}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 100,
    marginTop:20
  },
  textContainer: {
    marginTop: 17,
  },
  welcomeTextContainer: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    letterSpacing: -0.96,
    textAlign: "center",
    fontWeight: "700",
  },
  greetingContainer: {
    marginTop: 8,
  },
  greetingText: {
    fontSize: 25,
    letterSpacing: -1,
    fontWeight: "700",
  },
  notificationContainer: {
    position: 'relative',
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default WelcomeHeader;
