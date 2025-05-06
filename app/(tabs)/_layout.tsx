import { router, Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import 'react-native-gesture-handler';
import { getFocusedRouteNameFromRoute, Route } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { t } from '../i18n';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';


const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const { t } = useTranslation();

  const colorScheme = useColorScheme();
const route = useRouter();
  // Function to dynamically set the tab bar style
  const getDynamicTabBarStyle = (route: Route<string>) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const hideOnScreens = ['Messages'];
    if (routeName && hideOnScreens.includes(routeName)) {
      return { display: 'none' };
    }

    const baseStyle: any = {
      display: 'flex',
      backgroundColor: route.name !== 'index' ? 'white' : '#00002aff',
      position: Platform.OS === 'ios' ? 'absolute' : 'relative',
      fontSize: 20,
    };

    return baseStyle;
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: getDynamicTabBarStyle(route),
        tabBarActiveBackgroundColor: '#513f7a68',
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          headerShown: false,
        }}
      />      
      <Tabs.Screen
        name="globe"
        options={{
          title: t("globe"),
          headerShown: false,
          tabBarIcon: ({color}) => <IconSymbol size={28} name="globe" color={color} />,
          // animation: 'slide'
        }}
      />

      <Tabs.Screen
        name="chats"
        options={{
          title: t("chats"),
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chat" color={color} />,

        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("me"),
          headerShown: false,
          tabBarIcon: ({color}) => <IconSymbol size={28} name="person" color={color} />

        }}
      />
    </Tabs>
  );
}
