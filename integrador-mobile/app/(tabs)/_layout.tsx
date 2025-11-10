import React from 'react';
import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/CustomTabBar';

export default function TabsLayout() {
  return (
    // AQUI ESTÁ A CORREÇÃO DEFINITIVA:
    // Esta opção 'screenOptions' aplicada diretamente no 'Tabs'
    // esconde o cabeçalho "pai" de TODAS as abas de uma vez por todas.
    <Tabs 
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }} 
    >
      <Tabs.Screen 
        name="ranking" 
        options={{ title: "Ranking" }} 
      />
      <Tabs.Screen 
        name="squads" 
        options={{ title: "Squads" }} 
      />
      <Tabs.Screen 
        name="home" 
        options={{ title: "Dashboard" }} 
      />
      <Tabs.Screen 
        name="uusuarios" 
        options={{ title: "Usuários" }} 
      />
      <Tabs.Screen 
        name="notificacoes" 
        options={{ title: "Notificações" }} 
      />
    </Tabs>
  );
}