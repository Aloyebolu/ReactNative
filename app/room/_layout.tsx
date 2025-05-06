import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateRoomScreen from './create';
import RoomScreen from '.'
import { Text, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// const Stack = createStackNavigator();

export default function App() {
  return (
    <Stack screenOptions={{ animation: 'slide_from_left', headerShown: false }} />
  );
}
