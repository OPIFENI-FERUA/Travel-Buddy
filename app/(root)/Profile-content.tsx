// app/profile.tsx
import { Image, View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Text } from "react-native";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileField from "@/components/ProfileField";
import UpdateButton from "@/components/UpdateButton";
import { router } from "expo-router";
import { icons } from "@/constants";
import { useState, useEffect } from "react";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { fetchAPI } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";

const Profile: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [form, setForm] = useState({
    name: "",
    email: "", 
    mobile: "",
    kin: "",
    gender: "",
    nin: "",
    profileImage: ""
  });
  const [isUploading, setIsUploading] = useState(false);

  type EditModeType = {
    name: boolean;
    email: boolean;
    mobile: boolean;
    kin: boolean;
    gender: boolean;
    nin: boolean;
  };

  const [editMode, setEditMode] = useState<EditModeType>({
    name: false,
    email: false,
    mobile: false,
    kin: false,
    gender: false,
    nin: false,
  });

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const response = await fetchAPI(`/(api)/profile?clerkId=${user.id}`, {
        method: 'GET',
      });

      if (response.success && response.profile) {
        setForm({
          name: response.profile.name || user.firstName || "",
          email: response.profile.email || user.emailAddresses[0]?.emailAddress || "",
          mobile: response.profile.mobile || "",
          kin: response.profile.kin || "",
          gender: response.profile.gender || "",
          nin: response.profile.nin || "",
          profileImage: response.profile.image_url || ""
        });
      } else {
        // If no profile exists, set basic info from Clerk
        setForm(prev => ({
          ...prev,
          name: user.firstName || "",
          email: user.emailAddresses[0]?.emailAddress || ""
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Fallback to Clerk data if fetch fails
      setForm(prev => ({
        ...prev,
        name: user.firstName || "",
        email: user.emailAddresses[0]?.emailAddress || ""
      }));
    }
  };

  // Load user data when component mounts
  useEffect(() => {
    if (isLoaded && user) {
      fetchUserProfile();
    }
  }, [isLoaded, user]);

  // Request permission for accessing the media library
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload profile images.');
      }
    })();
  }, []);

  const toggleEdit = (field: keyof EditModeType) => {
    setEditMode(prev => {
      const newEditMode = { ...prev };
      // Toggle the specified field and close others
      Object.keys(newEditMode).forEach(key => {
        newEditMode[key as keyof EditModeType] = key === field ? !prev[key as keyof EditModeType] : false;
      });
      return newEditMode;
    });
  };

  const pickImage = async () => {
    try {
      setIsUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        // Check image size
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (fileInfo.exists && fileInfo.size && fileInfo.size > 5 * 1024 * 1024) {
          Alert.alert("Error", "Image size should be less than 5MB");
          return;
        }
        setForm({ ...form, profileImage: uri });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      Alert.alert("Error", "Name is required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      Alert.alert("Error", "Please enter a valid email");
      return false;
    }
    if (!/^\d{10}$/.test(form.mobile)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return false;
    }
    if (!form.kin.trim()) {
      Alert.alert("Error", "Next of kin is required");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    if (!user) {
      Alert.alert("Error", "You must be logged in to update your profile");
      return;
    }
    
    try {
      setIsUploading(true);
      const formData = new FormData();
  
      // Add all form fields
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('mobile', form.mobile);
      formData.append('kin', form.kin);
      formData.append('gender', form.gender);
      formData.append('nin', form.nin);
      formData.append('clerkId', user.id);
  
      // Handle image upload
      if (form.profileImage && form.profileImage.startsWith('file://')) {
        const filename = form.profileImage.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        const imageData = {
          uri: form.profileImage,
          name: filename,
          type,
        };
  
        formData.append('profileImage', imageData as unknown as string);
      }

      const response = await fetchAPI('/(api)/profile', {
        method: 'POST',
        body: formData,
      });

      if (response.success) {
        Alert.alert("Success", response.message || "Profile updated successfully");
        // Update the form with the response data
        if (response.profile) {
          setForm(prev => ({
            ...prev,
            name: response.profile.name,
            email: response.profile.email,
            mobile: response.profile.mobile,
            kin: response.profile.kin,
            gender: response.profile.gender,
            nin: response.profile.nin,
            profileImage: response.profile.image_url || null
          }));
        }
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to update profile. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please sign in to view your profile</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Image source={icons.backArrow} resizeMode="contain" style={styles.backIcon} />
          </TouchableOpacity>
          
         
            <ProfileHeader 
            
              name={form.name} 
              image={{ uri: form.profileImage || user?.imageUrl }} 
            />
             <TouchableOpacity onPress={pickImage} disabled={isUploading}>
            {isUploading ? (
              <ActivityIndicator style={styles.editImageOverlay} color="#0000ff" />
            ) : (
              <View style={styles.editImageOverlay}>
                <Image source={icons.person} style={styles.editImageIcon} />
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.detailsContainer}>
            <ProfileField
              label="Name"
              value={form.name}
              onChangeText={(value) => setForm({ ...form, name: value })}
              icon={icons.profile}
              containerStyle={styles.nameContainer}
              onPress={() => toggleEdit('name')}
              editable={editMode.name}
            />
            <ProfileField
              label="Email"
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
              icon={icons.email1}
              containerStyle={styles.emailContainer}
              onPress={() => toggleEdit('email')}
              editable={editMode.email}
            />
            <ProfileField
              label="Mobile"
              value={form.mobile}
              onChangeText={(text) => {
                // Only allow numbers and limit to 10 digits
                const numericValue = text.replace(/[^0-9]/g, '').slice(0, 10);
                setForm({ ...form, mobile: numericValue });
              }}
              icon={icons.phone}
              containerStyle={styles.mobileContainer}
              onPress={() => toggleEdit('mobile')}
              editable={editMode.mobile}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <ProfileField
              label="Next of Kin"
              value={form.kin}
              onChangeText={(text) => {
                // Only allow numbers and limit to 10 digits
                const numericValue = text.replace(/[^0-9]/g, '').slice(0, 10);
                setForm({ ...form, kin: numericValue });
              }}
              icon={icons.phone}
              containerStyle={styles.mobileContainer}
              onPress={() => toggleEdit('mobile')}
              editable={editMode.mobile}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <ProfileField
              label="Gender"
              value={form.gender}
              onChangeText={(value) => setForm({ ...form, gender: value })}
              icon={icons.Gender}
              containerStyle={styles.genderContainer}
              onPress={() => toggleEdit('gender')}
              editable={editMode.gender}
            />
            <ProfileField
              label="NIN Number"
              value={form.nin}
              onChangeText={(value) => setForm({ ...form, nin: value })}
              icon={icons.profile}
              containerStyle={styles.ninContainer}
              onPress={() => toggleEdit('nin')}
              editable={editMode.nin}
            />
            
            <UpdateButton onPress={handleUpdate} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Helper function for icons
const getIconSource = (field: string) => {
  const iconMap: Record<string, any> = {
    name: icons.profile,
    email: icons.email1,
    mobile: icons.phone,
    kin: icons.phone,
    gender: icons.Gender,
    nin: icons.profile,
  };
  return iconMap[field] || icons.profile;
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    maxWidth: 480,
    width: "100%",
    marginHorizontal: "auto",
    paddingTop: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    left: 20,
    top: 60,
    position: "absolute",
    elevation: 5,
    zIndex: 10
  },
  backIcon: {
    width: 24,
    height: 24,
    elevation: 6
  },
  detailsContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 64,
    padding: 20,
    marginTop: 0,
  },
  editImageOverlay: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  editImageIcon: {
    width: 16,
    height: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#fff',
    alignSelf: 'center',
  },
  // Container styles for each field
  nameContainer: { marginBottom: 15 },
  emailContainer: { marginBottom: 15 },
  mobileContainer: { marginBottom: 15 },
  kinContainer: { marginBottom: 15 },
  genderContainer: { marginBottom: 15 },
  ninContainer: { marginBottom: 25 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Profile;




