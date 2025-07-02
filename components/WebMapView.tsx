// components/WebMapView.tsx
import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';

// Define the props type matching react-native-maps' MapView basic props
type WebMapViewProps = {
  style?: ViewStyle;
  children?: React.ReactNode;
  // Add other props you use from MapView
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onPress?: (event: any) => void;
  // Include any other MapView props you need to support
};

const WebMapView: React.FC<WebMapViewProps> = (props) => {
  const containerStyle: ViewStyle = {
    ...props.style,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  };

  const textStyle: TextStyle = {
    color: '#333',
    fontSize: 16,
  };

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>
        Map not supported on web
      </Text>
      {props.children}
    </View>
  );
};

export default WebMapView;