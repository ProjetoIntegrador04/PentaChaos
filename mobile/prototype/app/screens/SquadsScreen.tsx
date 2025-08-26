import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AddSquadModal from '../components/AddSquadModal';

export default function SquadsScreen() {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Squads</Text>
      <Text style={styles.subtitle}>Gerencie suas equipes aqui.</Text>
      <Button
        title="Adicionar Nova Squad"
        onPress={() => setModalVisible(true)}
      />
      <AddSquadModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color: "#2B73BB"
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
});