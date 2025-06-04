import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';


const Layout = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="find-ride" options={{ headerShown: false }} />
        <Stack.Screen name="courier" options={{ headerShown: false }} />
      <Stack.Screen name="courier1" options={{ headerShown: false }} />
      <Stack.Screen name="courier2" options={{ headerShown: false }} />
      <Stack.Screen name="courier3" options={{ headerShown: false }} />
      <Stack.Screen name="courier4" options={{ headerShown: false }} />
      <Stack.Screen name="payment" options={{ headerShown: false }} />
      <Stack.Screen name="Wallet" options={{ headerShown: false }} />
      <Stack.Screen name="Profile-content" options={{ headerShown: false }} />
      <Stack.Screen name="shipment-details" options={{ headerShown: false }} />
      <Stack.Screen name="faq" options={{ headerShown: false }} />
      <Stack.Screen name="terms" options={{ headerShown: false }} />
      <Stack.Screen name="privacy" options={{ headerShown: false }} />

    </Stack>

    </>


  );
}


export default Layout;