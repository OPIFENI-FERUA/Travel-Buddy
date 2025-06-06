import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { getNotificationInbox } from 'native-notify';
import { router } from 'expo-router';
import { icons } from '@/constants';



export default function NotificationInbox({ }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const notifications = await getNotificationInbox(30506, 'ZdQPm17wXDeF23KuP0X7hz', 10, 0);
      setData(notifications);
    };
    fetchNotifications();
  }, []);

  const renderItem = ({ item }: any) => (
    <View style={styles.noteCont}>
      <View style={styles.accentBar} />
      <View style={styles.noteContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerShadow}>
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
          <Text style={styles.headerText}>Notifications</Text>
        </View>
      </View>
      <View style={styles.body}>
        <FlatList
          data={data}
          keyExtractor={(item: any) => item.notification_id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyInbox}>No notifications found.</Text>}
        />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },   
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    backgroundColor: 'transparent',
  },
  header: {
    backgroundColor: '#3737FF',
    paddingVertical: 44,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
    

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
  headerText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  body: {
    flex: 1,
    padding: 16,
  },
  noteCont: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  accentBar: {
    width: 6,
    backgroundColor: '#3737FF',
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    height: '100%',
  },
  noteContent: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: '700',
    fontSize: 17,
    color: '#222',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  messageText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
    lineHeight: 21,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
  },
  emptyInbox: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
    fontSize: 16,
  },
});
