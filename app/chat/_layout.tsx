import React from 'react';
import { Stack } from 'expo-router';

export default function App() {
  return (

    <Stack 
      screenOptions={{ 
        animation: 'slide_from_left', 
        headerShown: true, 
        contentStyle: { backgroundColor: 'white' } 
      }} 
    >
      <Stack.Screen name="index" options={{ headerShown: false }}/>
      <Stack.Screen name="chat/[conversationId]" options={{ headerShown: false }} />
    </Stack>

  );
}
