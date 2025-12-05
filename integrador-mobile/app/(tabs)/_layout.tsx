import React from 'react';
import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/CustomTabBar';
import { PerfilModalProvider, usePerfilModal } from '@/context/PerfilModalContext';
import PerfilModal from '../perfilModal';

function TabsContent() {
  const { isVisible, closeModal } = usePerfilModal();

  return (
    <>
      <Tabs 
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }} 
      >
        <Tabs.Screen 
          name="frequencia" 
          options={{ title: "Frequência" }}
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
          name="usuarios" 
          options={{ title: "Usuários" }}
        />
        <Tabs.Screen 
          name="tarefas" 
          options={{ title: "Tarefas" }} 
        />
      </Tabs>

      {/* Modal de Perfil Global */}
      <PerfilModal visible={isVisible} onClose={closeModal} />
    </>
  );
}

export default function TabsLayout() {
  return (
    <PerfilModalProvider>
      <TabsContent />
    </PerfilModalProvider>
  );
}