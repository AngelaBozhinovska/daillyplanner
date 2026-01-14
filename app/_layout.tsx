import { Stack, Redirect } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { useAuth } from '../src/context/AuthContext';
import { Slot } from 'expo-router';
import { View } from 'react-native';

function RootLayoutNav() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/signin" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}