import MapView, { Marker } from 'react-native-maps';
import { Platform } from 'react-native';
import { View } from 'react-native';


interface MapProps {
  latitude: number;
  longitude: number;
  title?: string;
}

export function Map({ latitude, longitude, title }: MapProps) {
  if (Platform.OS === 'web') {
    return (
      <View className="w-full h-64 bg-gray-200">
        {/* web implementation using iframe or other web map service */}
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${latitude},${longitude}`}
        />
      </View>
    );
  }

  return (
    <MapView
      className="w-full h-64"
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker
        coordinate={{
          latitude,
          longitude,
        }}
        title={title}
      />
    </MapView>
  );
} 