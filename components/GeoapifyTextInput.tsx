import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import { icons } from '@/constants';
import { GeoapifyInputProps } from '@/types/type';

const geoapifyApiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;

const GeoapifyTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
  renderLeftButton,
}: GeoapifyInputProps) => {
  const [query, setQuery] = useState(initialLocation || '');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      const timer = setTimeout(() => {
        fetchSuggestions();
      }, 300); // Debounce 300ms

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${geoapifyApiKey}`
      );
      const data = await response.json();
      setSuggestions(data.features || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (item: any) => {
    setQuery(item.properties.formatted);
    setShowSuggestions(false);
    handlePress({
      latitude: item.properties.lat,
      longitude: item.properties.lon,
      address: item.properties.formatted,
    });
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputContainer, { backgroundColor: textInputBackgroundColor || 'white' }]}>
        {renderLeftButton ? (
          renderLeftButton()
        ) : (
          <View style={styles.iconContainer}>
            <Image
              source={icon || icons.search}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
        )}
        <TextInput
          style={styles.textInput}
          value={query}
          onChangeText={setQuery}
          placeholder={initialLocation || 'Where do you want to go?'}
          placeholderTextColor="gray"
          onFocus={() => query.length > 2 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={[styles.suggestionsContainer, { backgroundColor: textInputBackgroundColor || 'white' }]}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.properties.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.suggestionText}>
                  {item.properties.formatted}
                </Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="always"
          />
        </View>
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 50,
    borderRadius:40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 40,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 20,
    shadowColor: '#d4d4d4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24, // 6 in Tailwind = 24px
    height: 24,
    marginRight: 10,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'gray',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    maxHeight: 200,
    borderRadius: 10,
    shadowColor: '#d4d4d4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 14,
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
});

export default GeoapifyTextInput;