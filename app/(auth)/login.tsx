import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGoogleAuth } from '../../src/services/auth';
import { useAuthStore } from '../../src/stores/authStore';

export default function LoginScreen() {
  const { signIn, isLoading, error } = useGoogleAuth();
  const storeError = useAuthStore((s) => s.error);
  const setUser = useAuthStore((s) => s.setUser);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const displayError = error || storeError;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TransitTogether</Text>
      <Text style={styles.subtitle}>Commute smarter, together.</Text>

      {displayError && <Text style={styles.errorText}>{displayError}</Text>}

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={signIn}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </Text>
      </TouchableOpacity>

      {/* Dev Bypass for localhost development */}
      <TouchableOpacity
        style={[styles.button, { marginTop: 20, backgroundColor: '#333' }]}
        onPress={() => {
          setUser({
            id: 'dev-user',
            name: 'Dev User',
            email: 'dev@example.com',
            photoUrl: undefined,
          });
          setAccessToken('dev-token');
          router.replace('/(tabs)/home' as any);
        }}
      >
        <Text style={styles.buttonText}>Dev Bypass (Local Sign In)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#666', marginBottom: 30 },
  button: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  errorText: { color: 'red', marginBottom: 20, textAlign: 'center' },
});