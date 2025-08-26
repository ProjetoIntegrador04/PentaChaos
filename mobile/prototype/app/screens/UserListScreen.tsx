import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AddUserModal from '../components/AddUserModal';

export default function UserListScreen() { 
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuários</Text>
      <Button title="Adicionar Usuário" onPress={() => setModalVisible(true)} />
      <AddUserModal visible={isModalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color: "#2B73BB"
  },
  
});