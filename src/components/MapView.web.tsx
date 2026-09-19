// src/components/MapView.web.tsx
import 'leaflet/dist/leaflet.css'; // <-- crucial for map styling
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';

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
  // Web map uses center/zoom instead of region, but we'll map region to center
  region?: {
    latitude: number;
    longitude: number;
    latitudeDelta?: number; // not used directly
    longitudeDelta?: number;
  };
  markers?: MapMarker[];
  polylines?: MapPolyline[];
  style?: object;
}

export default function AppMapView({
  region = { latitude: 1.3521, longitude: 103.8198 },
  markers = [],
  polylines = [],
  style,
}: Props) {
  // Leaflet uses [lat, lng]
  const center: [number, number] = [region.latitude, region.longitude];
  const zoom = 12; // fixed for now, could be derived from delta later

  return (
    <div style={{ height: '100%', width: '100%', ...style }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <Marker key={m.id} position={[m.latitude, m.longitude]}>
            {(m.title || m.description) && (
              <Popup>
                <strong>{m.title}</strong>
                {m.description && <p>{m.description}</p>}
              </Popup>
            )}
          </Marker>
        ))}
        {polylines.map((line, index) => (
          <Polyline
            key={index}
            positions={line.coordinates.map((c) => [c.latitude, c.longitude])}
            pathOptions={{
              color: line.color || '#4285F4',
              weight: line.width || 4,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}