// app/_layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useGoogleAuth } from '../src/services/auth';
import { upsertUser } from '../src/services/user';
import { useAuthStore } from '../src/stores/authStore';

const queryClient = new QueryClient();

export default function RootLayout() {
  const { user, isLoading } = useAuthStore();
  const { user: googleUser, isLoading: googleLoading, error } = useGoogleAuth();

  // Sync Google auth result into Zustand
  useEffect(() => {
    if (googleUser) {
      useAuthStore.getState().setUser(googleUser);
    }
  }, [googleUser]);

  useEffect(() => {
    useAuthStore.getState().setLoading(googleLoading);
    if (error) useAuthStore.getState().setError(error);
  }, [googleLoading, error]);

  // Whenever user changes, upsert into Firestore
  useEffect(() => {
    if (user) {
      upsertUser(user).catch(console.error);
    }
  }, [user]);

  if (isLoading || googleLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="commute-setup" options={{ headerShown: true, title: 'Set up commute' }} />
      </Stack>
    </QueryClientProvider>
  );
}