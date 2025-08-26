import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { RootStackScreenProps } from '../navigation/types';

export default function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Button
        title="Entrar"
        onPress={() => navigation.replace('MainApp')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, marginBottom: 20 },
});