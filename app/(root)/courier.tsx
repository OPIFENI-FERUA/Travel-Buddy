import { StyleSheet, Text, View, TextInput, Switch, Image, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useState, useCallback } from 'react'
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps'
import { router } from 'expo-router'
import InputField from '@/components/InputField'
import DeliveryMeansDropdown, { DeliveryMeansOption } from '@/components/DeliveryMeansDropdown'
import { MaterialIcons } from '@expo/vector-icons'
import { fetchAPI } from '@/lib/fetch'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { useAuth } from '@clerk/clerk-expo'

interface FormData {
  // Sender Details
  senderName: string
  senderMobileNumber: string
  senderLocation: string
  senderStreet: string
  senderEstate: string
  
  // Receiver Details
  receiverName: string
  receiverMobileNumber: string
  receiverLocation: string
  receiverStreet: string
  receiverEstate: string
  
  // Package Details
  type: string
  isFragile: boolean
  hasTracking: boolean
  weight: string
  description: string
  deliveryMean: string
  goodsImage: string | null
}

export default function Courier() {
  const { userId } = useAuth();
  const [goodsImage, setGoodsImage] = useState<string | null>(null);
  const [selectedDeliveryMean, setSelectedDeliveryMean] = useState<DeliveryMeansOption | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const deliveryOptions: DeliveryMeansOption[] = [
    { id: '1', name: 'Nile Star', imageSource: require('@/assets/images/bus.jpeg') },
    { id: '2', name: 'Carlifornia', imageSource: require('@/assets/images/bus.jpeg') },
    { id: '3', name: 'Nile Coach', imageSource: require('@/assets/images/bus.jpeg') },
  ];

  const packageTypes = ["Electronics", "Document", "Clothes", "Foods", "Other"];

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Sorry, we need camera permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setGoodsImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Sorry, we need media library permissions to make this work!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setGoodsImage(result.assets[0].uri);
    }
  };
  

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (isValid) return;
  
    let base64Image = null;
    if (goodsImage) {
      base64Image = await FileSystem.readAsStringAsync(goodsImage, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }
  
    const payload = {
      clerkId: userId, // replace or fetch dynamically
      senderName: form.senderName,
      senderLocation: form.senderLocation,
      senderMobile: form.senderMobileNumber, // if applicable
      senderEstate: form.senderEstate,
      senderStreet: form.senderStreet,
      receiverName: form.receiverName,
      receiverLocation: form.receiverLocation,
      receiverMobile: form.receiverMobileNumber, // if applicable
      receiverEstate: form.receiverEstate,
      receiverStreet: form.receiverStreet,
      is_fragile: form.hasTracking,
      is_tracking: form.isFragile,
      description: form.description,
      weight: form.weight,
      image: base64Image ? `data:image/jpeg;base64,${base64Image}` : null,
      delivery_mean: form.deliveryMean
    };
  console.log(payload);
    try {
      const response = await fetchAPI('/api/bookings', {
        method: 'POST',
       
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      if (!response.ok) {
        console.error(result);
        Alert.alert('Error', result.error || 'Failed to submit');
        return;
      }
  
      Alert.alert("Success", "Booking submitted", [
        { text: "OK", onPress: () => router.push('/courier4') }
      ]);
    } catch (err) {
      console.error("Submit error:", err);
      Alert.alert('Error', 'Network or server issue');
    }
  };
  
  
  
  const [form, setForm] = useState<FormData>({
    senderName: '',
    senderMobileNumber: '',
    senderLocation: '',
    senderStreet: '',
    senderEstate: '',
    receiverName: '',
    receiverMobileNumber: '',
    receiverLocation: '',
    receiverStreet: '',
    receiverEstate: '',
    type: '',
    isFragile: false,
    hasTracking: false,
    weight: '',
    description: '',
    deliveryMean: '',
    goodsImage: null
  })



  const progressStepsStyle = {
    activeStepIconBorderColor: '#3737FF',
    activeLabelColor: '#3737FF',
    activeStepNumColor: '#ffffff',
    activeStepIconColor: '#3737FF',
    completedStepIconColor: '#3737FF',
    completedProgressBarColor: '#3737FF',
    completedCheckColor: '#FFFFFF'
  }

  const handleDeliverySelect = (option: DeliveryMeansOption) => {
    setSelectedDeliveryMean(option);
    handleChange('deliveryMean', option.name);
    if (errors.deliveryMean) {
      setErrors(prev => ({ ...prev, deliveryMean: '' }));
    }
  };
  

  const handleChange = useCallback((name: keyof FormData, value: any) => {
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }, [errors])

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!form.senderName) newErrors.senderName = 'Sender name is required';
    if (!form.senderMobileNumber) newErrors.senderMobileNumber = 'Sender mobile number is required';
    if (!form.receiverName) newErrors.receiverName = 'Receiver name is required';
    if (!form.receiverMobileNumber) newErrors.receiverMobileNumber = 'Receiver mobile number is required';
    if (!form.weight) newErrors.weight = 'Weight is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.deliveryMean) newErrors.deliveryMean = 'Please select a delivery method';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  

  return (
    <View style={styles.container}>
      <ProgressSteps {...progressStepsStyle}>
        <ProgressStep
          label="Sender Details"
          scrollable={true}
        >
        
      <View style={styles.container}>
        <View style={styles.sheaderContainer}>
          <Text style={styles.ssubtitle}>Enter the details below</Text>
        </View>
          <View style={styles.scard}>
            <InputField
              label="Sender Name"
              placeholder="Enter your full name"
              value={form.senderName}
              onChangeText={(value) => handleChange('senderName', value)}
              style={styles.sinputContainer}
              autoCapitalize="words"
            />

            <InputField
              label="Mobile number"
              placeholder="Enter your 10 digit no"
              value={form.senderMobileNumber}
              onChangeText={(value) => handleChange('senderMobileNumber', value)}
              style={styles.sinputContainer}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <InputField
              label="Location"
              placeholder="Sending From"
              value={form.senderLocation}
              onChangeText={(value) => handleChange('senderLocation', value)}
              style={styles.sinputContainer}
            />

            <Text style={styles.addressLabel}>Pick up Address</Text>
            <View style={styles.saddressInputs}>
              <InputField
                label="Street name"
                placeholder="Street name"
                value={form.senderStreet}
                onChangeText={(value) => handleChange('senderStreet', value)}
                style={styles.sstreetInput}
              />

              <InputField
                label="Estate name"
                placeholder="Estate name"
                value={form.senderEstate}
                onChangeText={(value) => handleChange('senderEstate', value)}
                style={styles.sstreetInput}
              />
            </View>
          </View>

        </View>
        </ProgressStep>

        <ProgressStep
          label="Receiver Details"
        >
         
         <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Receiver Details</Text>
          <Text style={styles.subtitle}>Enter the receiver's details below</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.card}>
            <InputField
              label="Receiver Name"
              placeholder="Enter receiver's full name"
              value={form.receiverName}
              onChangeText={(value) => handleChange('receiverName', value)}
              style={styles.inputContainer}
              autoCapitalize="words"
            />

            <InputField
              label="Mobile number"
              placeholder="Enter 10 digit number"
              value={form.receiverMobileNumber}
              onChangeText={(value) => handleChange('receiverMobileNumber', value)}
              style={styles.inputContainer}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <InputField
              label="Location"
              placeholder="Delivering To"
              value={form.receiverLocation}
              onChangeText={(value) => handleChange('receiverLocation', value)}
              style={styles.inputContainer}
            />
          </View>

          <View style={[styles.card, styles.addressCard]}>
            <Text style={styles.addressLabel}>Delivery Address</Text>
            <View style={styles.addressInputs}>
              <InputField
                label="Street"
                placeholder="Street name"
                value={form.receiverStreet}
                onChangeText={(value) => handleChange('receiverStreet', value)}
                style={styles.streetInput}
              />

              <InputField
                label="Estate"
                placeholder="Estate name"
                value={form.receiverEstate}
                onChangeText={(value) => handleChange('receiverEstate', value)}
                style={styles.streetInput}
              />
            </View>
          </View>
        </View>
      </View>
        </ProgressStep>

        <ProgressStep
          label="Package Details"
          onSubmit={handleSubmit}
        >
          
          <View style={styles.pcontainer}>
        <Text style={styles.ptitle}>About package</Text>

        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            Note: The packages will be rechecked by our pickup agents.
          </Text>
        </View>

        <View style={styles.typeContainer}>
          {packageTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                form.type === type && styles.selectedType,
              ]}
              onPress={() => handleChange('type', type)}
            >
              <Text style={[
                styles.typeText,
                form.type === type && styles.selectedTypeText
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.optionsContainer}>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>Fragile</Text>
            <Switch
              value={form.isFragile}
              onValueChange={(value) => handleChange('isFragile', value)}
              trackColor={{ false: "#e9ecef", true: "#3737ff" }}
            />
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>Tracking</Text>
            <Switch
              value={form.hasTracking}
              onValueChange={(value) => handleChange('hasTracking', value)}
              trackColor={{ false: "#e9ecef", true: "#3737ff" }}
            />
          </View>
        </View>

        <View style={styles.weightContainer}>
          <Text style={styles.weightLabel}>Weight (kg)</Text>
          <TextInput
            style={[styles.weightInput, errors.weight && styles.errorInput]}
            value={form.weight}
            onChangeText={(text) => handleChange('weight', text)}
            placeholder="Enter weight"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
          {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Courier Description</Text>
          <TextInput
            style={[styles.descriptionInput, errors.description && styles.errorInput]}
            multiline
            numberOfLines={4}
            value={form.description}
            onChangeText={(text) => handleChange('description', text)}
            placeholder="Tell us about your products"
            placeholderTextColor="#666"
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        <View style={styles.optionsContainer}>
          <Text style={styles.optionText}>Choose Delivery Means</Text>
          <DeliveryMeansDropdown
            options={deliveryOptions}
            onSelect={handleDeliverySelect}
            initialPrompt="Select a delivery method"
          />
          {errors.deliveryMean && <Text style={styles.errorText}>{errors.deliveryMean}</Text>}
        </View>

        {goodsImage && (
          <Image source={{ uri: goodsImage }} style={styles.goodsImage} />
        )}
        <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
          <MaterialIcons name="camera-alt" size={28} color="white" />
          <Text style={styles.cameraButtonText}>Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
          <MaterialIcons name="image" size={28} color="white" />
          <Text style={styles.cameraButtonText}>Pick from Gallery</Text>
        </TouchableOpacity>

      </View>
        </ProgressStep>
      </ProgressSteps>
    </View>
  )
}
const styles = StyleSheet.create({

  container: {
    flex: 1,

  },
  sheaderContainer: {
    marginBottom: 30,
    paddingHorizontal: 4,
  },
  ssubtitle: {
    fontSize: 16,
    fontFamily: "Jakarta-Regular",
    letterSpacing: -0.32,
    color: "#666",
  },
  sformContainer: {
    gap: 24,
  },
  scard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  saddressCard: {
    paddingTop: 24,
  },
  sinputContainer: {
    marginBottom: 20,
  },
  saddressLabel: {
    color: "#000",
    fontFamily: "Jakarta-Bold",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  saddressInputs: {
    gap: 16,
  },
  sstreetInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    fontFamily: "Jakarta-Semibold",
  },
  headerContainer: {
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  title: {
    color: "#1a1a1a",
    fontFamily: "Jakarta-Bold",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Jakarta-Regular",
    letterSpacing: -0.32,
    color: "#666",
  },
  formContainer: { gap: 24 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  addressCard: { paddingTop: 24 },
  inputContainer: { marginBottom: 20 },
  addressLabel: {
    color: "#000",
    fontFamily: "Jakarta-Bold",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  addressInputs: { gap: 16 },
  streetInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },

  // step3
  scrollContent: {
    paddingBottom: 30,
  },
  pcontainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ptitle: {
    fontSize: 24,
    fontFamily: "Jakarta-Bold",
    marginBottom: 16,
    color: "#333",
  },
  noteContainer: {
    backgroundColor: "#e7f9e7",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  noteText: {
    color: "#2d862d",
    fontSize: 14,
    fontFamily: "Jakarta-Regular",
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedType: {
    backgroundColor: "#3737ff",
  },
  typeText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Jakarta-Regular",
  },
  selectedTypeText: {
    color: "#fff",
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  optionText: {
    fontFamily: "Jakarta-Bold",
    fontSize: 16,
    color: "#333",
  },
  weightContainer: {
    marginBottom: 24,
  },
  weightLabel: {
    fontFamily: "Jakarta-Regular",
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  weightInput: {
    fontSize: 16,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 8,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    fontFamily: "Jakarta-Regular",
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionLabel: {
    fontFamily: "Jakarta-Regular",
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  descriptionInput: {
    fontSize: 16,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlignVertical: "top",
  },
  goodsImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: "contain",
  },
  cameraButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3737ff",
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    marginBottom: 16,
  },
  cameraButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontFamily: "Jakarta-Regular",
  },
});
