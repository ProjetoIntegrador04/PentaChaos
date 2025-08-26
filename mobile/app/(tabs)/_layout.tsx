import React from 'react';
import { Tabs } from 'expo-router';
// CAMINHO CORRIGIDO ABAIXO
import CustomTabBar from '~/components/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="ranking" options={{ headerShown: false }} />
      <Tabs.Screen name="squads" options={{ headerShown: false }} />
      <Tabs.Screen name="home" options={{ headerShown: false }} />
      <Tabs.Screen name="usuarios" options={{ headerShown: false }} />
      <Tabs.Screen name="notificacoes" options={{ headerShown: false }} />
    </Tabs>
  );
}