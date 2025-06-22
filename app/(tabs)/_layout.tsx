import React from 'react';
import { Tabs } from 'expo-router';
import { AntDesign, Feather } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0296E5', 
        tabBarInactiveTintColor: '#E5E5E5', 
        tabBarStyle: {
          backgroundColor: '#242A32',
          borderTopWidth: 0,
          
          height: 90, 
          paddingTop: 10, 
          paddingBottom: 15, 
        },
        
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
        headerShown: false, 
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            
            <AntDesign 
              name="home" 
              size={32} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Busca',
          tabBarIcon: ({ color }) => (
            <Feather 
              name="search" 
              size={32} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'Watch list',
          tabBarIcon: ({ color }) => (
            <Feather 
              name="bookmark" 
              size={32} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}