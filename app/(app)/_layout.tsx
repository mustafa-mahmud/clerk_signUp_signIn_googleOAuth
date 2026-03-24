import { Stack } from 'expo-router';
import { View, Text } from 'react-native';

const AppLayout = () => {
  ///////////////////////////////////////////////////
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default AppLayout;
