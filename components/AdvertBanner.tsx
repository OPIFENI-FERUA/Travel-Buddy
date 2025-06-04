import * as React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface AdvertBannerProps {
  imageUrl: string;
}

const AdvertBanner: React.FC<AdvertBannerProps> = ({ imageUrl }) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>ADVERTS & OFFERS{"\n\n"}EVERY FRIDAY </Text>
      </View>
      <Image source={{ uri: imageUrl }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 11,
    paddingLeft: 22,
    paddingRight: 3,
    paddingTop: 19,
    paddingBottom: 44,
    backgroundColor: "#3737ff", // Assuming black background based on white text
  },
  textContainer: {
    marginTop: 19,
    marginRight: -26,
  },
  text: {
    fontSize: 20,
    color: "rgba(255, 255, 255, 1)",
    letterSpacing: -0.8,
    lineHeight: 20,
    fontWeight: "700",
  },
  image: {
    aspectRatio: 2.09,
    width: 205,
    maxWidth: "100%",
  },
});

export default AdvertBanner;
