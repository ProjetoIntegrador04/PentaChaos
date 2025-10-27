import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Este componente SÓ será usado na web
export default function MapDisplay() {
  return (
    <View style={styles.mapPlaceholder}>
      <Text style={styles.mapPlaceholderText}>
        Visualização do mapa indisponível nesta plataforma.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0', // Fundo cinza
    borderRadius: 15, // Para combinar com o container
  },
  mapPlaceholderText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});