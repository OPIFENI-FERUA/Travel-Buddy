import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, ImageSourcePropType, View, StyleSheet, Text, Platform } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabIcon = ({
  source,
  focused,
  label,
}: {
  source: ImageSourcePropType;
  focused: boolean;
  label: string;
}) => (
  <View style={styles.tabIconWrapper}>
    <View
      style={[
        styles.tabIconContainer,
        focused && styles.tabIconContainerFocused,
      ]}
    >
      <View
        style={[
          styles.tabIconInnerContainer,
          focused && styles.tabIconInnerContainerFocused,
        ]}
      >
        <Image
          source={source}
          tintColor={focused ? "#fff" : "#666"}
          resizeMode="contain"
          style={[
            styles.tabIconImage,
            focused && styles.tabIconImageFocused
          ]}
        />
      </View>
    </View>
    <Text style={[
      styles.tabLabel,
      focused && styles.tabLabelFocused
    ]}>
      {label}
    </Text>
  </View>
);

const Layout = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <>
      <StatusBar style="default" />
      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarActiveTintColor: "#3737ff",
          tabBarInactiveTintColor: "#666",
          tabBarShowLabel: false,
          tabBarStyle: {
            ...styles.tabBar,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom + 2 : 10,
            height: Platform.OS === 'ios' ? 84 + insets.bottom : 56,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.home} focused={focused} label="Home" />
            ),
          }}
        />

        <Tabs.Screen
          name="rides"
          options={{
            title: "Rides",
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.list} focused={focused} label="Bookings" />
            ),
          }}
        />
        <Tabs.Screen
          name="Track"
          options={{
            title: "Track",
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.track} focused={focused} label="Track" />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.chat} focused={focused} label="Chat" />
            ),
          }}
        /> */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <TabIcon source={icons.profile} focused={focused} label="Profile" />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default Layout;

const styles = StyleSheet.create({
  tabIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    marginBottom: 10,
    width: 60,
  },
  tabIconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 1000,
    marginBottom: 0,
    padding: 1,
  },
  tabIconContainerFocused: {
    backgroundColor: "#3737ff",
    ...Platform.select({
      ios: {
        shadowColor: "#3737ff",
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 80,
      },
    }),
  },
  tabIconInnerContainer: {
    borderRadius: 1000,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconInnerContainerFocused: {
    transform: [{ scale: 1.1 }],
  },
  tabIconImage: {
    width: 24,
    height: 24,
    opacity: 1,
  },
  tabIconImageFocused: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Jakarta-Medium",
    marginTop: 2,
    opacity: 0.8,
  },
  tabLabelFocused: {
    color: "#3737ff",
    fontFamily: "Jakarta-Bold",
    opacity: 1,
  },
  tabBar: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 8,
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    borderTopWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 16,
      },
    }),
  },
});