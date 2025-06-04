import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { router } from 'expo-router';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Notification categories for different types of notifications
export const NOTIFICATION_CATEGORIES = {
  TRACKING: 'tracking',
  DELIVERY: 'delivery',
  SYSTEM: 'system',
} as const;

// Initialize notifications
export const initializeNotifications = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }

  // Configure notification channels for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('tracking', {
      name: 'Tracking Updates',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });

    await Notifications.setNotificationChannelAsync('delivery', {
      name: 'Delivery Updates',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Set up notification response handler
  Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    
    // Handle notification tap based on category
    switch (data.category) {
      case NOTIFICATION_CATEGORIES.TRACKING:
        router.push('/(root)/(tabs)/Track');
        break;
      case NOTIFICATION_CATEGORIES.DELIVERY:
        router.push('/(root)/(tabs)/Track');
        break;
      default:
        break;
    }
  });
};

// Send local notification
export const sendLocalNotification = async ({
  title,
  body,
  data = {},
  category = NOTIFICATION_CATEGORIES.SYSTEM,
}: {
  title: string;
  body: string;
  data?: Record<string, any>;
  category?: keyof typeof NOTIFICATION_CATEGORIES;
}) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { ...data, category },
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // null means show immediately
  });
};

// Send tracking update notification
export const sendTrackingUpdate = async ({
  location,
  eta,
  status,
}: {
  location: { latitude: number; longitude: number };
  eta?: number;
  status?: string;
}) => {
  const title = 'Location Update';
  const body = eta
    ? `ETA: ${Math.round(eta)} minutes`
    : status || 'Location updated';

  await sendLocalNotification({
    title,
    body,
    data: { location, eta, status },
    category: NOTIFICATION_CATEGORIES.TRACKING,
  });
};

// Send delivery status notification
export const sendDeliveryStatus = async ({
  status,
  location,
  message,
}: {
  status: string;
  location?: { latitude: number; longitude: number };
  message?: string;
}) => {
  const title = 'Delivery Update';
  const body = message || `Status: ${status}`;

  await sendLocalNotification({
    title,
    body,
    data: { status, location },
    category: NOTIFICATION_CATEGORIES.DELIVERY,
  });
};

// Send geofence notification
export const sendGeofenceNotification = async ({
  type,
  locationName,
}: {
  type: 'enter' | 'exit';
  locationName: string;
}) => {
  const title = 'Location Alert';
  const body = `You have ${type}ed ${locationName}`;

  await sendLocalNotification({
    title,
    body,
    data: { type, locationName },
    category: NOTIFICATION_CATEGORIES.TRACKING,
  });
}; 