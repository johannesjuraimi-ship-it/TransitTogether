// src/components/MapView.native.tsx
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, Region } from 'react-native-maps';

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
}

export interface MapPolyline {
  coordinates: Array<{ latitude: number; longitude: number }>;
  color?: string;
  width?: number;
}

interface Props {
  region?: Region;
  markers?: MapMarker[];
  polylines?: MapPolyline[];
  style?: object;
}

export default function AppMapView({
  region = {
    latitude: 1.3521,   // Singapore default
    longitude: 103.8198,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  },
  markers = [],
  polylines = [],
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        initialRegion={region}
        provider={PROVIDER_DEFAULT}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            title={m.title}
            description={m.description}
          />
        ))}
        {polylines.map((line, index) => (
          <Polyline
            key={index}
            coordinates={line.coordinates}
            strokeColor={line.color || '#4285F4'}
            strokeWidth={line.width || 4}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});