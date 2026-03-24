import React, { useCallback, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { View, Button, Platform, Text } from 'react-native';

//MITHU NOTE:: go that link to install ecriptoAES:: https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignIn() {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: 'oauth_google',
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }

            router.push(decorateUrl('/'));
          },
        });
      } else {
        console.log('I am error from else');
      }
    } catch (err) {
      console.log('I am error');
    }
  }, []);

  return (
    <View>
      <Button title="Sign in with Google" onPress={onPress} />
    </View>
  );
}
