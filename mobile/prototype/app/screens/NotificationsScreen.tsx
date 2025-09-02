import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const NOTIFICATIONS = [
  { id: '1', title: 'Novo login detectado', time: '5 min atrás' },
  { id: '2', title: 'Squad "Alfa" completou uma tarefa', time: '1 hora atrás' },
  { id: '3', title: 'Parabéns! Você alcançou o 3º lugar no ranking.', time: '3 horas atrás' },
  { id: '4', title: 'Manutenção programada para amanhã', time: '1 dia atrás' },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações</Text>
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2B73BB'
  },
  list: {
    width: '100%',
  },
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginHorizontal: 10,
  },
  notificationTitle: {
    fontSize: 16,
  },
  notificationTime: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
});