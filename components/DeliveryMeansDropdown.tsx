import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
  ImageSourcePropType,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFormStore } from '@/store/useFormStore';

interface Option {
  id: string;
  name: string;
  imageSource: ImageSourcePropType;
}

interface DeliveryMeansDropdownProps {
  options: Option[];
  onSelect: (option: Option) => void;
  initialPrompt?: string;
}

const DeliveryMeansDropdown: React.FC<DeliveryMeansDropdownProps> = ({
  options,
  onSelect,
  initialPrompt = 'Choose Delivery Means',
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);


  const handleSelectOption = (option: Option) => {
    // Update local state
    setSelectedOption(option);

    
    
    // Call external onSelect callback
    onSelect(option);
    
    // Close modal
    setModalVisible(false);
  };

  const renderOption = ({ item }: { item: Option }) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => handleSelectOption(item)}
    >
      <Image source={item.imageSource} style={styles.optionIcon} />
      <Text style={styles.optionText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        {selectedOption?.imageSource && (
           <Image source={selectedOption.imageSource} style={styles.selectedIcon} />
        )}
        <Text style={styles.dropdownButtonText}>
          {selectedOption ? selectedOption.name : initialPrompt}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color="#555" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)} // Close modal on outside touch
        >
          <SafeAreaView style={styles.modalContentContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Delivery Mean</Text>
              <FlatList
                data={options}
                renderItem={renderOption}
                keyExtractor={(item) => item.id}
                style={styles.optionsList}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontFamily: 'JakartaMedium',
    color: '#555',
    flex: 1,
    textAlign: 'left',
    marginLeft: 5,
  },
  selectedIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContentContainer: {
     backgroundColor: 'white',
     borderTopLeftRadius: 20,
     borderTopRightRadius: 20,
  },
  modalContent: {
    padding: 20,
    paddingBottom: 10, // Reduce bottom padding for close button
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'JakartaBold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  optionsList: {
    maxHeight: 250, // Limit height for scrollability
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'JakartaRegular',
    color: '#333',
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'JakartaSemiBold',
    color: '#3737FF', // Use primary color for close text
  },
});

export default DeliveryMeansDropdown;
export type { Option as DeliveryMeansOption }; // Export Option type if needed elsewhere 