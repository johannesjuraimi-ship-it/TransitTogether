// src/utils/scheduleReminder.native.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false; // handled separately
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleLeaveReminder(eventTitle: string, leaveTime: Date): Promise<string | null> {
  // Only schedule if leaveTime is in the future
  if (leaveTime.getTime() <= Date.now()) return null;

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: '🚇 Time to Leave!',
      body: `You should head out for "${eventTitle}".`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: leaveTime,
    },
  });
  return identifier;
}