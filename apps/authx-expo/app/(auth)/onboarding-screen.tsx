import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, XStack } from 'tamagui';

import { useSession } from '~/context/session-provider';

WebBrowser.maybeCompleteAuthSession();

export default function OnboardingScreen() {
  const { signIn } = useSession();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  return (
    <Stack flex={1} paddingTop={insets.top} paddingBottom={insets.bottom}>
      <StatusBar backgroundColor="" style="light" />

      {/* <XStack gap={8} marginHorizontal={12}>
        {onboardingSteps.map((step, index) => (
          <Stack
            key={index}
            flex={1}
            height={3}
            borderRadius={1000}
            backgroundColor={index === screenIndex ? 'rgba(225,225,225,1)' : 'rgba(225,225,225,.5)'}
          />
        ))}
      </XStack> */}

      <Stack padding={16} flex={1}>
        <Stack marginTop="auto">
          <XStack marginTop={16} alignItems="center" gap={16} justifyContent="center">
            <Pressable
              onPress={signIn}
              style={{
                backgroundColor: 'rgba(225,225,225,1)',
                borderRadius: 1000,
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                height: 52,
              }}>
              <>
                {/* <XStack alignItems="center">
                        <Image
                          source={require('../../assets/images/googlelogo.png')}
                          width={23}
                          height={23}
                          marginRight={10}
                        />
                        <Text
                          color="rgba(0,0,0,1)"
                          fontFamily={'InterSemi' as FontTokens}
                          fontSize={17}>
                          Continue with NSUT ID
                        </Text>
                      </XStack> */}
              </>
            </Pressable>
          </XStack>
        </Stack>
      </Stack>
    </Stack>
  );
}
