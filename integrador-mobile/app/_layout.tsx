import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AuthProvider } from '../context/AuthContext';
import { ProfileImageProvider } from '../context/ProfileImageContext';

// Configuração do handler de notificações
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

export default function RootLayout() {
  // Pede permissão de notificação ao carregar o app
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Atenção', 'Você precisa permitir as notificações para receber alertas de tarefas!');
      }
    };
    requestPermissions();
  }, []);

  return (  
    <AuthProvider>
      <ProfileImageProvider>
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="squadDetail" options={{ headerShown: false }} /> 
          <Stack.Screen name="perfil" options={{ headerShown: false }} />
          <Stack.Screen name="userDetail" options={{ headerShown: false }} />
          <Stack.Screen name="notificacoes" options={{ headerShown: false }} />
          <Stack.Screen name="clockentry" options={{ headerShown: false }} />
        
        {/* Modal de Nova Tarefa */}
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal', 
            headerShown: false, 
            title: 'Nova Tarefa'
          }} 
        />
        
        {/* Modal de Cadastrar Usuário */}
        <Stack.Screen 
          name="cadastrarUsuarioModal" 
          options={{ 
            presentation: 'modal', 
            headerShown: false, 
            title: 'Cadastrar Usuário'
          }} 
        />

        {/* Modal de Editar Usuário */}
        <Stack.Screen 
          name="editarUsuarioModal" 
          options={{ 
            presentation: 'modal', 
            headerShown: false, 
            title: 'Editar Usuário'
          }} 
        />

        {/* Modal de Cadastrar Squad */}
        <Stack.Screen 
          name="cadastrarSquadModal" 
          options={{ 
            presentation: 'modal', 
            headerShown: false, 
            title: 'Cadastrar Squad'
          }} 
        />
        </Stack>
      </ProfileImageProvider>
    </AuthProvider>
  );
}