import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image } from 'expo-image';


interface ImageDropZoneProps {
  onImageReceived: (uri: string) => void;
}

export default function ImageDropZone({ onImageReceived }: ImageDropZoneProps) {
  const [image, setImage] = useState<string | null>(null);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  // Use image picker as the primary method for all platforms
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      onImageReceived(result.assets[0].uri);
    }
  };

  // Set up a tap gesture
  const tap = Gesture.Tap()
    .onStart(() => {
      opacity.value = withTiming(0.8, { duration: 100 });
    })
    .onFinalize(() => {
      opacity.value = withTiming(1, { duration: 100 });
      pickImage();
    });

  return (
    <SafeAreaView style={styles.container}>
      <GestureDetector gesture={tap}>
        <Animated.View style={[styles.dropZone, animatedStyle]}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                {Platform.OS === 'ios' ? 
                  'Tap to select an image from your photos' : 
                  'Tap to select an image'}
              </Text>
              <Text style={styles.infoText}>
                On iOS, you can also long-press an image in Photos app and drag it here
              </Text>
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropZone: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 10,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholder: {
    padding: 20,
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 8,
  },
  infoText: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
}); 