import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dados de exemplo
const notifications = [
  { id: '1', title: 'Tarefa Atualizada', message: 'Sua tarefa "Testar deploy" foi movida para "EM ANDAMENTO".' },
  { id: '2', title: 'Novo Ponto Registrado', message: 'Seu ponto das 12h05 foi registrado.' },
  { id: '3', title: 'Frequência Atualizada', message: 'Sua frequência de Outubro foi fechada.' },
];

export default function NotificacoesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Cabeçalho Fixo com Botão Voltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 40 }} /> {/* Espaço para centralizar o título */}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Ionicons name="notifications-circle" size={40} color="#0A4A8E" />
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationMessage}>{item.message}</Text>
            </View>
          </View>
        )}
        style={styles.container}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A4A8E' },
  header: {
    backgroundColor: '#0A4A8E',
    paddingVertical: 20,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  backButton: { padding: 5, width: 40 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  notificationCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notificationTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});