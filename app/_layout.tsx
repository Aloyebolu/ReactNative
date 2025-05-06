import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useRouter } from 'expo-router'; // ✅ useRouter instead of useNavigation
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FloatingDraggableButton from '@/components/FloatingIcon';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { fetchUser } from './utils/user';
import {getSocket, initiateSocket} from '@/app/utils/socket'
import { CustomAlertProvider } from './context/CustomAlertContext';
// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [user, setUser] = useState({})
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(()=>{
      const fetchUserData = async() =>{
        const user = await fetchUser();
        setUser(user);
      };
      fetchUserData();
    }, [])

  useEffect(() => {
    const init = async () => {
      if (!loaded) return;

      await SplashScreen.hideAsync();

      try {
        const token = await AsyncStorage.getItem('user');
        if (token) {
          router.replace('/(tabs)');
        } else {
          router.replace('/auth');
        }
      } catch (err) {
        console.log("Token error:", err.message);
      }
    };

    init();
  }, [loaded]); // 👈 Depend on `loaded`, so it only runs after fonts are ready

  useEffect(() => {
    if (user && user.userId) {
      initiateSocket(user.userId);
    }
  }, [user]);
  

  if (!loaded) return null;

  return (
    <GestureHandlerRootView>

    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
      <FloatingDraggableButton/>
      <CustomAlertProvider>
      <Stack screenOptions={{ animation: 'slide_from_right', animationDuration: 500  }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 500  }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 500  }} />
        <Stack.Screen name="auth" options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 500  }} />
        <Stack.Screen name="room" options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 500  }} />
        <Stack.Screen name="chat" options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 500  }} />
        <Stack.Screen name="profile" options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 500  }} />
        <Stack.Screen name="settings" options={{ headerShown: false, animation: 'slide_from_right', animationDuration: 500 }} />

      </Stack>
      </CustomAlertProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
    </GestureHandlerRootView>
  );
}
