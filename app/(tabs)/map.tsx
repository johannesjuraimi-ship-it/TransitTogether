// app/(tabs)/map.tsx
import { StyleSheet, Text, View } from 'react-native';
import AppMapView, { MapMarker, MapPolyline } from '../../src/components/MapView';

// Mock data: two friends and a route
const FRIEND_MARKERS: MapMarker[] = [
  {
    id: 'friend1',
    latitude: 1.3505,
    longitude: 103.8198,
    title: 'Alice',
    description: 'Near Orchard',
  },
  {
    id: 'friend2',
    latitude: 1.355,
    longitude: 103.825,
    title: 'Bob',
    description: 'Near Somerset',
  },
];

const SAMPLE_ROUTE: MapPolyline = {
  coordinates: [
    { latitude: 1.3521, longitude: 103.8198 }, // start
    { latitude: 1.3505, longitude: 103.8198 },
    { latitude: 1.355,  longitude: 103.825 },  // end
  ],
  color: '#4285F4',
  width: 4,
};

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <AppMapView
        style={styles.map}
        region={{
          latitude: 1.3521,
          longitude: 103.822,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        markers={FRIEND_MARKERS}
        polylines={[SAMPLE_ROUTE]}
      />
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>👥 2 friends · Route shown</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  overlay: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderRadius: 8,
    elevation: 3,
  },
  overlayText: { textAlign: 'center', fontSize: 16, fontWeight: '500' },
});