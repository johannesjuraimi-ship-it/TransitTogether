// src/components/BusArrivalCard.tsx
import { StyleSheet, Text, View } from 'react-native';
import { BusArrival } from '../services/lta';

function formatMinutes(isoDate: string): string {
  if (!isoDate) return 'N/A';
  const arrival = new Date(isoDate);
  const now = new Date();
  const diffMs = arrival.getTime() - now.getTime();
  if (diffMs < 0) return 'Arrived';
  const mins = Math.floor(diffMs / 60000);
  if (mins === 0) return 'Arriving';
  return `${mins} min`;
}

function loadColor(load: string): string {
  switch (load) {
    case 'Seats Available': return '#27ae60';
    case 'Standing Available': return '#f1c40f';
    case 'Limited Standing': return '#e67e22';
    default: return '#999';
  }
}

export default function BusArrivalCard({ item }: { item: BusArrival }) {
  const next = item.NextBus;
  const sub = item.SubsequentBus;
  const sub2 = item.SubsequentBus3;

  return (
    <View style={styles.card}>
      <Text style={styles.serviceNo}>{item.ServiceNo}</Text>
      <View style={styles.busList}>
        {next && (
          <View style={styles.busItem}>
            <Text style={styles.eta}>{formatMinutes(next.EstimatedArrival)}</Text>
            <View style={[styles.loadBadge, { backgroundColor: loadColor(next.Load) }]}>
              <Text style={styles.loadText}>{next.Load}</Text>
            </View>
          </View>
        )}
        {sub && (
          <View style={styles.busItem}>
            <Text style={styles.eta}>{formatMinutes(sub.EstimatedArrival)}</Text>
            <View style={[styles.loadBadge, { backgroundColor: loadColor(sub.Load) }]}>
              <Text style={styles.loadText}>{sub.Load}</Text>
            </View>
          </View>
        )}
        {sub2 && (
          <View style={styles.busItem}>
            <Text style={styles.eta}>{formatMinutes(sub2.EstimatedArrival)}</Text>
            <View style={[styles.loadBadge, { backgroundColor: loadColor(sub2.Load) }]}>
              <Text style={styles.loadText}>{sub2.Load}</Text>
            </View>
          </View>
        )}
        {!next && !sub && !sub2 && <Text style={styles.noData}>No arrival data</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceNo: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  busList: { gap: 8 },
  busItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eta: { fontSize: 16, fontWeight: '500' },
  loadBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loadText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  noData: { color: '#999', fontStyle: 'italic' },
});