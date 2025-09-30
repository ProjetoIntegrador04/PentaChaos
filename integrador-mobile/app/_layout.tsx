import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    // A propriedade initialRouteName="index" FORÇA o app a começar no seu login
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}