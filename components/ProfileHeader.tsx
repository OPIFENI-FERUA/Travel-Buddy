import * as React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  ImageSourcePropType,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

interface ProfileHeaderProps {
  name: string;
  image: ImageSourcePropType;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, image }) => {
  const [profileImage, setProfileImage] = React.useState<ImageSourcePropType>(image);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images', // ✅ Just use a string
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    
    

    if (!result.canceled && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setProfileImage({ uri: selectedAsset.uri });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My profile</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
          <Image
            source={profileImage || require("@/assets/images/image1.jpg")}
            style={styles.profileImage}
          />
          <View style={styles.editIcon}>
            <MaterialIcons name="edit" size={20} color="white" />
          </View>
        </TouchableOpacity>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

    width: "100%",
    
    paddingTop: 27,
    paddingBottom: 33,
    alignItems: "center",
    backgroundColor: "#3737ff",
  },
  content: {
    alignItems: "center",
    width: 124,
  },
  title: {
    fontFamily: "Plus Jakarta Sans, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 23,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.92,
  },
  imageWrapper: {
    marginTop: 16,
    position: "relative",
  },
  profileImage: {
    width: 102,
    height: 102,
    borderRadius: 51,
    borderWidth: 2,
    borderColor: "white",
  },
  editIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#0008",
    borderRadius: 12,
    padding: 2,
  },
  nameContainer: {
    marginTop: 12,
    alignSelf: "stretch",
  },
  name: {
    fontFamily: "Plus Jakarta Sans, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 23,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.92,
  },
});

export default ProfileHeader;
