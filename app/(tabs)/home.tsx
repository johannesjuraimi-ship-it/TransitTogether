// app/(tabs)/home.tsx (updated)
import { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import BusArrivalCard from '../../src/components/BusArrivalCard';
import { useBusArrival } from '../../src/hooks/useBusArrivals';
import { useStationCrowd } from '../../src/hooks/useStationCrowd';
import { BusArrival } from '../../src/services/lta';

export default function HomeScreen() {
  const [busStopCode, setBusStopCode] = useState('');
  const [queryBusStop, setQueryBusStop] = useState('');
  const [stationCode, setStationCode] = useState('');
  const [queryStation, setQueryStation] = useState('');

  const {
    data: busData,
    isLoading: busLoading,
    error: busError,
    dataUpdatedAt: busUpdatedAt,
  } = useBusArrival(queryBusStop);

  const {
    data: crowdData,
    isLoading: crowdLoading,
    error: crowdError,
  } = useStationCrowd(queryStation);

  const handleBusSearch = () => {
    if (busStopCode.trim()) setQueryBusStop(busStopCode.trim());
  };

  const handleCrowdSearch = () => {
    if (stationCode.trim()) setQueryStation(stationCode.trim().toUpperCase());
  };

  return (
    <View style={styles.container}>
      {/* Bus Arrival Section */}
      <Text style={styles.sectionTitle}>🚌 Bus Arrivals</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Bus Stop Code (e.g. 83139)"
          value={busStopCode}
          onChangeText={setBusStopCode}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleBusSearch}>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>

      {busLoading && <ActivityIndicator style={{ marginVertical: 20 }} />}
      {busError && <Text style={styles.error}>Error: {busError.message}</Text>}

      {busData && busData.length > 0 && (
        <>
          <Text style={styles.lastUpdated}>
            Last updated: {new Date(busUpdatedAt || Date.now()).toLocaleTimeString()}
          </Text>
          <FlatList
            data={busData}
            keyExtractor={(item, index) => `${item.ServiceNo}-${index}`}
            renderItem={({ item }: { item: BusArrival }) => <BusArrivalCard item={item} />}
            style={{ marginBottom: 20 }}
          />
        </>
      )}
      {busData && busData.length === 0 && (
        <Text style={styles.empty}>No arrivals for this stop.</Text>
      )}

      {/* MRT Crowd Section */}
      <Text style={styles.sectionTitle}>🚇 Station Crowd Level</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Station Code (e.g. EW1)"
          value={stationCode}
          onChangeText={setStationCode}
          autoCapitalize="characters"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleCrowdSearch}>
          <Text style={styles.searchText}>Check</Text>
        </TouchableOpacity>
      </View>

      {crowdLoading && <ActivityIndicator style={{ marginVertical: 20 }} />}
      {crowdError && <Text style={styles.error}>Error: {crowdError.message}</Text>}

      {crowdData && crowdData.length > 0 && (
        <View style={styles.crowdCard}>
          <Text style={styles.stationName}>{crowdData[0].Station}</Text>
          <View style={[styles.crowdBadge, { backgroundColor: getCrowdColor(crowdData[0].CrowdLevel) }]}>
            <Text style={styles.crowdText}>{crowdData[0].CrowdLevel}</Text>
          </View>
          <Text style={styles.crowdTime}>
            {new Date(crowdData[0].StartTime).toLocaleTimeString()} – {new Date(crowdData[0].EndTime).toLocaleTimeString()}
          </Text>
        </View>
      )}
      {crowdData && crowdData.length === 0 && (
        <Text style={styles.empty}>Station not found or no crowd data.</Text>
      )}
    </View>
  );
}

function getCrowdColor(level: string): string {
  switch (level.toLowerCase()) {
    case 'low': return '#27ae60';
    case 'medium': return '#f1c40f';
    case 'high': return '#e74c3c';
    default: return '#999';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f7' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  inputRow: { flexDirection: 'row', marginBottom: 10 },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  searchText: { color: '#fff', fontWeight: '600' },
  error: { color: 'red', marginBottom: 10 },
  empty: { color: '#999', marginVertical: 20, textAlign: 'center' },
  lastUpdated: { fontSize: 12, color: '#999', textAlign: 'right', marginBottom: 5 },
  crowdCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stationName: { fontSize: 18, fontWeight: 'bold' },
  crowdBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  crowdText: { color: '#fff', fontWeight: '600' },
  crowdTime: { fontSize: 12, color: '#666' },
});