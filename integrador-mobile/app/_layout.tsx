import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="squadDetail" options={{ headerShown: false }} /> 
      <Stack.Screen name="perfil" options={{ headerShown: false }} />
      <Stack.Screen name="userDetail" options={{ headerShown: false }} />
      <Stack.Screen name="notificacoes" options={{ headerShown: false }} />
      
      <Stack.Screen 
        name="modal" 
        options={{ 
          presentation: 'modal', 
          headerShown: false, 
          title: 'Nova Tarefa'
        }} 
      />
    </Stack>
  );
}