import { Redirect, Stack } from 'expo-router';
import * as React from 'react';
import { YStack } from 'tamagui';
import { useSession } from '~/context/session-provider';
export default function Layout() {
  const { jwtToken, isJwtLoading } = useSession();

  if (isJwtLoading) {
    return <YStack backgroundColor="#000" flex={1}></YStack>;
  }

  if (!jwtToken) {
    return <Redirect href="/(auth)/onboarding-screen" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(drawer)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
