// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../src/stores/authStore';
import { useGoogleAuth } from '../src/services/auth';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { user, isLoading } = useAuthStore();
  const { user: googleUser, isLoading: googleLoading, error } = useGoogleAuth();

  // Sync Google auth hook result to Zustand store
  useEffect(() => {
    if (googleUser) {
      useAuthStore.getState().setUser(googleUser);
    }
  }, [googleUser]);

  // Update loading/error states
  useEffect(() => {
    useAuthStore.getState().setLoading(googleLoading);
    if (error) {
      useAuthStore.getState().setError(error);
    }
  }, [googleLoading, error]);

  // While we check auth state, show a splash/loading
  if (isLoading || googleLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        // Authenticated user sees the main tab navigator
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        // Not authenticated – show login
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}