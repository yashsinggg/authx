import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import * as React from 'react';
import { useEffect } from 'react';
import { useStorageState } from '~/hooks/use-storage-state';
import { fetchGoogleLogin } from '~/utils/auth';

interface AuthContextType {
  signIn: () => void;
  signOut: () => void;

  /////////////////////////////////////////////// setting tokens  ///////////////////////////////////////////////
  jwtToken: string | null;
  setJwtToken: (value: string | null) => void;
  isJwtLoading: boolean;

  refreshToken: string | null;
  setRefreshToken: (value: string | null) => void;
  isRefreshLoading: boolean;

  streamToken: string | null;
  setStreamToken: (value: string | null) => void;
  isStreamLoading: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);
// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production' && !value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }
  return value!;
}

export function SessionProvider(props: React.PropsWithChildren<{}>) {
  ////////////////////////////////////////////////////// tokens /////////////////////////////////////////////////
  const [[isJwtLoading, jwtToken], setJwtToken] = useStorageState('jwtToken');
  const [[isRefreshLoading, refreshToken], setRefreshToken] = useStorageState('refreshToken');
  const [[isStreamLoading, streamToken], setStreamToken] = useStorageState('streamToken');

  // google oauth keys
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '224100756216-gcfhthrul7nk6sdsflejs9e2r0r34nm5.apps.googleusercontent.com',
    iosClientId: '224100756216-k1s6b8me5jap48bkpot60muunrocca3e.apps.googleusercontent.com',
    clientId: '845922293689-dh5bdfd4knvng8k508d3tsmuat4dtk4s.apps.googleusercontent.com',
    webClientId: '224100756216-plnofum01thj47k4qkeufb532ibpmnqb.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      const accessToken = response.authentication?.accessToken;

      // Use the fetchGoogleLogin function from api.js
      console.log('idToken:', idToken);
      fetchGoogleLogin(idToken as string)
        .then(async (response) => {
          if (response.status === 200 && response.data) {
            if (!response.data.isOfficialNameSet || !response.data.isAnonymousNameSet) {
              setTimeout(() => {
                router.replace({
                  pathname: '/(drawer)/(tabs)',
                  params: {
                    isThisOnBoardingFlow: 'true',
                  },
                });
              }, 500);
            } else {
              setTimeout(() => {
                router.replace('/(auth)/community-guidelines');
              }, 500);
            }

            console.log('Response:', response);
            console.log('loggg', response.data);

            /////////////////////////////////////////////////////////////// setting tokens /////////////////////////////////////////////////
            setJwtToken(response.headers['x-access-token']);
            setRefreshToken(response.headers['x-refresh-token']);
            setStreamToken(response.headers['x-stream-token']);

            // removing google auth
            await AuthSession.revokeAsync(
              {
                token: accessToken as string,
              },
              {
                revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
              }
            );
          }
        })
        .catch((error) => {
          console.log('Error:', error);
          handleSignOut();
          setTimeout(() => {
            router.replace('/(auth)/404-screen');
          }, 500);
        });
    }
  }, [response]);

  const handleSignOut = () => {
    /////////////////////////////////////////////// setting tokens ///////////////////////////////////////////////
    setJwtToken(null);

    setRefreshToken(null);

    setStreamToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          // @ts-ignore
          promptAsync({ useProxy: true, showInRecents: true });
        },
        signOut: handleSignOut,

        ///////////////////////////////////////// setting tokens ///////////////////////////////////////////////

        jwtToken,
        setJwtToken,
        isJwtLoading,

        refreshToken,
        setRefreshToken,
        isRefreshLoading,

        streamToken,
        setStreamToken,
        isStreamLoading,

      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
