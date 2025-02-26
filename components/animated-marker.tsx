import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import { View, StyleSheet, Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { Image } from 'expo-image';
import { useEffect } from 'react';


interface AnimatedMarkerProps {
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  delay?: number;
  image?: any;
  customCallout?: boolean;
}

export default function AnimatedMapMarker({
  latitude,
  longitude,
  title,
  image,
  description = '',
  delay = 0,
  customCallout = false,
}: AnimatedMarkerProps) {
  const scale = useSharedValue(0);
  
  useEffect(() => {
    // use requestAnimationFrame to ensure the component is mounted
    // before starting the animation
    const animationFrame = requestAnimationFrame(() => {
      scale.value = withDelay(
        delay,
        withSpring(1, { damping: 12, stiffness: 100 })
      );
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  return (
    <Marker
      coordinate={{
        latitude,
        longitude
      }}
      title={customCallout ? undefined : title}
      description={customCallout ? undefined : description}
      tracksViewChanges={false} // improve performance by disabling view tracking
    >
      <Animated.View 
        entering={FadeIn.delay(delay)} 
        style={animatedStyle}
      >
        {image ? (
          <Image source={process.env.EXPO_PUBLIC_API_URL + image.url} style={styles.marker} contentFit="cover" />
        ) : (
          <View className="w-8 h-8 bg-primary rounded-full items-center justify-center border-2 border-white">
            <View className="w-4 h-4 bg-white rounded-full" />
          </View>
        )}
      </Animated.View>
      
      {customCallout && (
        <Callout>
          <View style={styles.calloutContainer}>
            <Text style={styles.calloutTitle}>{title}</Text>
            {description ? <Text style={styles.calloutDescription}>{description}</Text> : null}
          </View>
        </Callout>
      )}
    </Marker>
  );
} 

const styles = StyleSheet.create({
  marker: {
    width: 34,
    height: 34,
    borderRadius: 99,
    borderWidth: 3,
    borderColor: '#fff',
  },
  calloutContainer: {
    width: 200,
    padding: 0,
  },
  calloutTitle: {
		textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutDescription: {
    textAlign: 'center',
    fontSize: 14,
  },
});

