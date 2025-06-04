import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import HeaderSection from "@/components/HeaderSection";
import SenderDetailsForm from "@/components/SenderDetailsForm";

interface FormData {
  name: string;
  mobileNumber: string;
  location: string;
  street: string;
  estate: string;
}

const HOME: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    senderName: '',
    senderMobileNumber: '',
    senderLocation: '',
    senderStreet: '',
    senderEstate: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Pass these handlers directly to SenderDetailsForm
  const handleNameChange = (value: string) => {
    setFormData(prev => ({ ...prev, name: value }));
    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
  };

  const handleMobileChange = (value: string) => {
    setFormData(prev => ({ ...prev, mobileNumber: value }));
    if (errors.mobileNumber) setErrors(prev => ({ ...prev, mobileNumber: '' }));
  };

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({ ...prev, location: value }));
    if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
  };

  const handleStreetChange = (value: string) => {
    setFormData(prev => ({ ...prev, street: value }));
    if (errors.street) setErrors(prev => ({ ...prev, street: '' }));
  };

  const handleEstateChange = (value: string) => {
    setFormData(prev => ({ ...prev, estate: value }));
    if (errors.estate) setErrors(prev => ({ ...prev, estate: '' }));
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <HeaderSection />
        <SenderDetailsForm
          formData={formData}
          errors={errors}
          onNameChange={handleNameChange}
          onMobileChange={handleMobileChange}
          onLocationChange={handleLocationChange}
          onStreetChange={handleStreetChange}
          onEstateChange={handleEstateChange}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderStyle: "solid",
    borderWidth: 1,
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 480,
    width: "100%",
    overflow: "hidden",
    fontFamily: "Jakarta-Bold",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: -0.8,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default HOME;
