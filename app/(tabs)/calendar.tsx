import * as Notifications from 'expo-notifications'; // for foreground handler (native)
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCalendarEvents } from '../../src/hooks/useCalendarEvents';
import { CalendarEvent } from '../../src/services/calendar';
import { useAuthStore } from '../../src/stores/authStore';
import { requestNotificationPermission, scheduleLeaveReminder } from '../../src/utils/scheduleReminder';

// Set up a notification handler so that scheduled notifications appear even when the app is open (native only).
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export default function CalendarScreen() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const { data: events, isLoading, error } = useCalendarEvents();
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Request notification permission on mount (native only)
  useEffect(() => {
    requestNotificationPermission().then(setPermissionGranted);
  }, []);

  // Calculate a leave time (current time + default buffer – in a real app you’d use transit ETA)
  const getLeaveTime = (eventStart: string): Date => {
    const start = new Date(eventStart);
    const travelTimeMinutes = 30; // placeholder – later will be dynamic from LTA
    return new Date(start.getTime() - travelTimeMinutes * 60 * 1000);
  };

  const handleSetReminder = async (event: CalendarEvent) => {
    if (!event.start.dateTime) {
      Alert.alert('All-day events not supported for reminders yet.');
      return;
    }

    const leaveTime = getLeaveTime(event.start.dateTime);
    if (leaveTime <= new Date()) {
      Alert.alert('The event starts too soon to set a reminder.');
      return;
    }

    try {
      const id = await scheduleLeaveReminder(event.summary || 'Event', leaveTime);
      if (id) {
        Alert.alert(
          'Reminder Set',
          `You'll be notified at ${leaveTime.toLocaleTimeString()} to leave for "${event.summary}".`
        );
      } else {
        Alert.alert('Could not schedule reminder (possibly in the past).');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const renderEvent = ({ item }: { item: CalendarEvent }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.summary || 'No title'}</Text>
      {item.start.dateTime && (
        <Text style={styles.eventTime}>
          {new Date(item.start.dateTime).toLocaleString()}
        </Text>
      )}
      {item.location && <Text style={styles.eventLocation}>📍 {item.location}</Text>}
      <TouchableOpacity
        style={styles.reminderButton}
        onPress={() => handleSetReminder(item)}
      >
        <Text style={styles.reminderButtonText}>⏰ Set Leave Reminder</Text>
      </TouchableOpacity>
    </View>
  );

  if (!accessToken) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>
          Please sign in with Google (with Calendar permission) to see your events.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load events: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📅 Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        ListEmptyComponent={<Text style={styles.emptyText}>No upcoming events.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f7' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  eventTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  eventTime: { fontSize: 14, color: '#666', marginBottom: 4 },
  eventLocation: { fontSize: 14, color: '#666', marginBottom: 8 },
  reminderButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  reminderButtonText: { color: '#fff', fontWeight: '600' },
  infoText: { fontSize: 16, textAlign: 'center', color: '#666' },
  errorText: { color: 'red', textAlign: 'center' },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#999' },
});