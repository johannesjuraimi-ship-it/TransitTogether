import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';

export default function Index() {
  const user = useAuthStore((s) => s.user);

  if (user) {
    return <Redirect href={'/(tabs)/home' as any} />;
  }

  return <Redirect href={'/(auth)/login' as any} />;
}