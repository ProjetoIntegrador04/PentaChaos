import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { RootStackScreenProps } from '../navigation/types';

export default function LoadingScreen({ navigation }: RootStackScreenProps<'Loading'>) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 1500);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu App</Text>
      <ActivityIndicator size="large" color="#007BFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});