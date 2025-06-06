import React, { useState, useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface AdvertBannerProps {
  images: (string | number)[];
  autoScrollInterval?: number;
}

const { width } = Dimensions.get('window');

const AdvertBanner: React.FC<AdvertBannerProps> = ({ 
  images, 
  autoScrollInterval = 5000 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (activeIndex + 1) % images.length;
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true
        });
        setActiveIndex(nextIndex);
      }
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [activeIndex, images.length, autoScrollInterval]);

  const renderItem = ({ item }: { item: string | number }) => {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={typeof item === 'string' ? { uri: item } : item}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    );
  };

  const renderDot = (index: number) => {
    const isActive = index === activeIndex;
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withSpring(isActive ? 1.2 : 1) }],
      opacity: withSpring(isActive ? 1 : 0.5),
    }));

    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
              index,
              animated: true
            });
            setActiveIndex(index);
          }
        }}
      >
        <Animated.View
          style={[
            styles.dot,
            isActive && styles.activeDot,
            animatedStyle
          ]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveIndex(newIndex);
        }}
      />
      <View style={styles.dotsContainer}>
        {images.map((_, index) => renderDot(index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 180,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    width: width - 32, // Account for padding
    height: 180,
    paddingHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#3737ff',
  },
});

export default AdvertBanner;
