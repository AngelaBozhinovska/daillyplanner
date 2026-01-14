import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function AuthLayout() {
  const { user, loading } = useAuth();

  // Handle loading state
  if (loading) {
    return null;
  }

  // Redirect to tabs if user is authenticated
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
    </Stack>
  );
} 