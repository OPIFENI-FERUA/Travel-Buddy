import React, { memo } from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { DriverCardProps } from "@/types/type";

const DriverCard = memo(({ item, selected, setSelected }: DriverCardProps) => {
  const isSelected = selected === item.id;
  const rating = item.rating ?? 4; // Fallback to 4 if rating is undefined

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={setSelected}
      style={[
        styles.container,
        isSelected ? styles.selectedContainer : styles.defaultContainer
      ]}
    >
      <Image
        source={{ uri: item.profile_image_url }}
        style={styles.profileImage}
        resizeMode="cover"
        accessibilityLabel={`${item.title}'s profile`}
      />

      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>

          <View style={styles.ratingContainer}>
            <Image 
              source={icons.star} 
              style={styles.starIcon} 
              accessibilityLabel="Rating"
            />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Image 
              source={icons.dollar} 
              style={styles.detailIcon} 
              accessibilityLabel="Price"
            />
            <Text style={styles.detailText}>${item.price}</Text>
          </View>

          <Text style={styles.separator}>|</Text>

          <Text style={styles.detailText}>
            {formatTime(item.time ?? 0)}
          </Text>

          <Text style={styles.separator}>|</Text>

          <Text style={styles.detailText}>
            {item.car_seats} seat{item.car_seats !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      <Image
        source={{ uri: item.car_image_url }}
        style={styles.carImage}
        resizeMode="contain"
        accessibilityLabel={`${item.title}'s car`}
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  defaultContainer: {
    backgroundColor: 'white',
  },
  selectedContainer: {
    backgroundColor: '#E5E7EB', // Equivalent to bg-general-600
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  infoContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 18,
    fontFamily: 'JakartaRegular',
    maxWidth: '60%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  starIcon: {
    width: 14,
    height: 14,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'JakartaRegular',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'JakartaRegular',
    color: '#374151', // Equivalent to text-general-800
  },
  separator: {
    fontSize: 14,
    fontFamily: 'JakartaRegular',
    color: '#374151',
    marginHorizontal: 4,
  },
  carImage: {
    width: 56,
    height: 56,
  },
});

export default DriverCard;