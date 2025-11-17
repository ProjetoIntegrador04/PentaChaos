import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

// --- CORREÇÃO DE SINTAXE DEFINITIVA ---
// O 'handleNotification' PRECISA do argumento 'notification'
// E as propriedades corretas são 'shouldShowBanner' e 'shouldShowList'
Notifications.setNotificationHandler({
  handleNotification: async (notification) => { 
    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});
// --- FIM DA CORREÇÃO ---

export default function RootLayout() {
  // Pede permissão de notificação ao carregar o app
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Você precisa permitir as notificações para receber alertas de tarefas!');
      }
    };
    requestPermissions();
  }, []);

  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="squadDetail" options={{ headerShown: false }} /> 
      <Stack.Screen name="perfil" options={{ headerShown: false }} />
      <Stack.Screen name="userDetail" options={{ headerShown: false }} />
      <Stack.Screen name="notificacoes" options={{ headerShown: false }} />
      
      {/* Registra o modal de Nova Tarefa */}
      <Stack.Screen 
        name="modal" 
        options={{ 
          presentation: 'modal', 
          headerShown: false, 
          title: 'Nova Tarefa'
        }} 
      />
      {/* Registra o modal de Cadastrar Usuário */}
      <Stack.Screen 
        name="cadastrarUsuarioModal" 
        options={{ 
          presentation: 'modal', 
          headerShown: false, 
          title: 'Cadastrar Usuário'
        }} 
      />
    </Stack>
  );
}