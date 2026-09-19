// src/services/auth.ts
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store'; // <-- NEW
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';

WebBrowser.maybeCompleteAuthSession();

interface UserInfo {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

async function getUserInfo(accessToken: string): Promise<UserInfo> {
  const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    photoUrl: data.picture,
  };
}

import { Platform } from 'react-native';

// --- Secure token storage with web fallback ---
const TOKEN_KEY = 'google_access_token';
const REFRESH_KEY = 'google_refresh_token';

export async function saveTokens(accessToken: string, refreshToken?: string) {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, accessToken);
      if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
    }
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
  if (refreshToken) {
    await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
  }
}

export async function getStoredTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      return {
        accessToken: localStorage.getItem(TOKEN_KEY),
        refreshToken: localStorage.getItem(REFRESH_KEY),
      };
    }
    return { accessToken: null, refreshToken: null };
  }
  const accessToken = await SecureStore.getItemAsync(TOKEN_KEY);
  const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
  return { accessToken, refreshToken };
}

export async function clearTokens() {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
    }
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}
// ----------------------------------

export function useGoogleAuth() {
  const [user, setUser] = React.useState<UserInfo | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null); // NEW
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!;
  const redirectUri = makeRedirectUri({
    scheme: 'transittogether',
    path: 'oauthredirect',
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId,
    scopes: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events',
    ],
    redirectUri,
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        setIsLoading(true);
        // Save tokens
        saveTokens(authentication.accessToken, authentication.refreshToken).catch(console.error);
        setAccessToken(authentication.accessToken);

        getUserInfo(authentication.accessToken)
          .then((userInfo) => {
            setUser(userInfo);
            setError(null);
          })
          .catch((err) => {
            setError('Failed to fetch user info');
            console.error(err);
          })
          .finally(() => setIsLoading(false));
      }
    } else if (response?.type === 'error') {
      setError(response.error?.message ?? 'Authentication failed');
    }
  }, [response]);

  const signIn = () => promptAsync();

  const signOut = async () => {
    setUser(null);
    setAccessToken(null);
    await clearTokens();
  };

  return { user, accessToken, isLoading, error, signIn, signOut, request };
}