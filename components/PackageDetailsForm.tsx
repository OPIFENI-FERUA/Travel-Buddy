import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import ProceedButton from "@/components/ProceedButton";
import { router, useFocusEffect } from "expo-router";
import { useFormStore } from "@/store/useFormStore";
import DeliveryMeansDropdown, { DeliveryMeansOption } from "@/components/DeliveryMeansDropdown";


const PackageDetailsForm: React.FC = () => {
  const formData = useFormStore((state) => state.getFormData());
  const { packaged: packageData,updatePackage} = useFormStore();
  const packaged = useFormStore((state) => state.packaged);

  const [form, setForm] = useState({
    type: packageData.type || "Electronics",
    isFragile: packageData.isFragile || false,
    hasTracking: packageData.hasTracking || false,
    description: packageData.description || "",
    weight: packageData.weight?.toString() || "",
    image: packageData.image?.toString() || "",
  });

  const [goodsImage, setGoodsImage] = useState<string | null>(packageData.image || null);
  const [selectedDeliveryMean, setSelectedDeliveryMean] = useState<DeliveryMeansOption | null>(null);
  const [errors, setErrors] = useState({
    weight: "",
    description: "",
    deliveryMean: "",
  });

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

  const handleDeliverySelect = (option: DeliveryMeansOption) => {
    setSelectedDeliveryMean(option);
    setErrors(prev => ({ ...prev, deliveryMean: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      weight: !form.weight
        ? "Weight is required"
        : isNaN(parseFloat(form.weight))
          ? "Enter a valid weight"
          : "",
      description: !form.description ? "Description is required" : "",
      deliveryMean: !selectedDeliveryMean ? "Please select a delivery method" : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  useFocusEffect(
    useCallback(() => {
      setForm({
        type: packaged.type || "Electronics",
        isFragile: packaged.isFragile || false,
        hasTracking: packaged.hasTracking || false,
        description: packaged.description || "",
        weight: packaged.weight?.toString() || "",
        image: packaged.image?.toString() || "",
      });
      setGoodsImage(packaged.image || null);
      setSelectedDeliveryMean(packaged.deliveryMeans ? 
        deliveryOptions.find(option => option.name === packaged.deliveryMeans) ?? null
        : null
      );
    }, [packaged])
  );
  

const handleProceed = () => {
  if (!validateForm()) {
    Alert.alert("Validation Error", "Please fix the errors before proceeding");
    return;
  }

  updatePackage({
    type: form.type,
    isFragile: form.isFragile,
    hasTracking: form.hasTracking,
    description: form.description,
    weight: form.weight,
    deliveryMeans: selectedDeliveryMean?.name ?? "",
    image: goodsImage ? goodsImage : undefined
  });
  console.log(updatePackage);
  router.push("/courier4");
};

  

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <ScrollView 
      style={styles.scrollView} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <Text style={styles.title}>About package</Text>

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

        <ProceedButton 
          onPress={handleProceed}
          disabled={Object.values(errors).some(error => error !== "")}
          
        />
      </View>
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  container: {
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
  title: {
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

export default PackageDetailsForm;
