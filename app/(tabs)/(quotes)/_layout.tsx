import { Stack } from 'expo-router';
import React from 'react';

export default function AddQuoteLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4b0082', // example style
        },
        headerTintColor: '#fff',
      }}
    >
      {/*
        By default, `index.tsx` in this folder
        matches "(quotes)/index" => so we define a Stack.Screen for name="index"
      */}
      <Stack.Screen
        name="index"
        options={{ title: 'Add Quote' }}
      />
    </Stack>
  );
}
