import React from 'react';
import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs 
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }} 
    >
      <Tabs.Screen name="frequencia" options={{ title: "Frequência" }} /> 
      <Tabs.Screen name="squads" options={{ title: "Squads" }} />
      <Tabs.Screen name="home" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="uusuarios" options={{ title: "Usuários" }} />
      <Tabs.Screen name="tarefas" options={{ title: "Tarefas" }} /> 
    </Tabs>
  );
}