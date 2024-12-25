// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      {/*
        1) HOME TAB
        Point this to the folder "(home)" instead of the single file "index".
        This means that the file-based router will load app/(tabs)/(home)/_layout.tsx
      */}
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      {/*
        2) NOTIFICATIONS TAB
        Now we point to the folder "(notifications)".
        This will load app/(tabs)/(notifications)/_layout.tsx 
      */}
      <Tabs.Screen
        name="(notifications)"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="bell.fill" color={color} />
          ),
        }}
      />

      {/*
        3) FAVORITES TAB
        Points to the folder "(favorites)" => app/(tabs)/(favorites)
      */}
      <Tabs.Screen
        name="(favorites)"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="star.fill" color={color} />
          ),
        }}
      />

      {/*
        4) EXPLORE TAB
        We keep the existing "explore.tsx" file so this references name="explore"
      */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
      {/*
        4) Quote TAB
        We keep the existing "explore.tsx" file so this references name="explore"
      */}
      <Tabs.Screen
        name="(quotes)"
        options={{
          title: 'Quote',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="doc.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
