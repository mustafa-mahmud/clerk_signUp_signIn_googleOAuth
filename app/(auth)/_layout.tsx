import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

const AuthLayout = () => {
  ///////////////////////////////////////////////////
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  );
};

export default AuthLayout;
