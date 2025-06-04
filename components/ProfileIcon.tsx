import React from "react";
import { View } from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

interface ProfileIconProps {
  name: "wallet" | "notifications" | "terms" | "privacy" | "faq" | "logout";
  size?: number;
  color?: string;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({
  name,
  size = 34,
  color = "black",
}) => {
  switch (name) {
    case "wallet":
      return <MaterialCommunityIcons name="wallet" size={size} color={color} />;
    case "notifications":
      return <Ionicons name="notifications" size={size} color={color} />;
    case "terms":
      return <FontAwesome5 name="file-contract" size={size} color={color} />;
    case "privacy":
      return (
        <MaterialCommunityIcons
          name="shield-account"
          size={size}
          color={color}
        />
      );
    case "faq":
      return (
        <MaterialCommunityIcons
          name="frequently-asked-questions"
          size={size}
          color={color}
        />
      );
    case "logout":
      return <MaterialCommunityIcons name="logout" size={size} color={color} />;
    default:
      return <View />;
  }
};

export default ProfileIcon;
