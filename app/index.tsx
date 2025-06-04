import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import React from "react";
import 'react-native-get-random-values';
import{v4 as uuidv4} from 'uuid';

const Page = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) return <Redirect href="./(root)/(tabs)/home" />;

  return <Redirect href="/(auth)/welcome" />;
};

export default Page;