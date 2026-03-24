import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { useColorScheme } from '@/hooks/use-color-scheme';
import './../global.css';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

export const unstable_settings = {
  anchor: '(tabs)',
};

const RootStack = () => {
  const { isSignedIn, isLoaded } = useAuth();

  console.log('isSignedIn', isSignedIn);
  ////////////////////////////////////////////
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={!!isSignedIn}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
      </Stack>
      <StatusBar style="dark" />
    </>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <RootStack />
      </ClerkProvider>
    </ThemeProvider>
  );
}
