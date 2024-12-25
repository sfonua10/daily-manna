import { Stack } from 'expo-router';
import React from 'react';

export default function NotificationsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4b0082',
        },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Notification' }}
      />
      {/*
        If you also want an index.tsx in this folder, 
        you would do <Stack.Screen name="index" ... /> 
      */}
    </Stack>
  );
}
