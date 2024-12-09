import { Stack } from 'expo-router';
import * as React from 'react';
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="onboarding-screen"
        options={{
          headerShown: true,
          title: 'Auth',
        }}
      />
    </Stack>
  );
}
