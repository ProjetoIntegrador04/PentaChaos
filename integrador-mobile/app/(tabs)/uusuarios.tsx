import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave para carregar o nome (deve ser a mesma da tela de Perfil)
const PROFILE_NOME_KEY = 'profile_nome';

// --- DEFINIÇÃO DO TIPO ---
type UserType = {
  id: string;
  name: string;
  status: 'active' | 'inactive'; 
};

// --- AQUI ESTÁ A LISTA ATUALIZADA COM 10 NOMES ---
const usersData: UserType[] = [
  { id: '1', name: 'David Francisco', status: 'active' },
  { id: '2', name: 'Ana Clara', status: 'active' },
  { id: '3', name: 'Lucas Souza', status: 'active' },
  { id: '4', name: 'Mariana Costa', status: 'active' },
  { id: '5', name: 'Pedro Henrique', status: 'active' },
  { id: '6', name: 'Juliana Silva', status: 'active' },
  { id: '7', name: 'Gabriel Alves', status: 'active' },
  { id: '8', name: 'Beatriz Lima', status: 'active' },
  { id: '9', name: 'Matheus Pereira', status: 'active' },
  { id: '10', name: 'Laura Mendes', status: 'active' },
];

const UserItem = ({ item }: { item: UserType }) => (
  <View style={styles.listItemContainer}>
    {/* Contêiner para o Status, para alinhar com a coluna */}
    <View style={styles.statusContainer}>
      <View style={[styles.statusIndicator, item.status === 'active' ? styles.statusActive : styles.statusInactive]} />
    </View>
    <Text style={styles.userNameText}>{item.name}</Text>
    {/* Navega para a tela de detalhe do usuário */}
    <TouchableOpacity onPress={() => router.push({ pathname: '/userDetail' as any, params: { userId: item.id } })}>
      <Text style={styles.verMaisText}>Ver mais</Text>
    </TouchableOpacity>
  </View>
);

export default function UserControlScreen() {
  const [userName, setUserName] = useState("Marcelo"); 

  useFocusEffect(
    React.useCallback(() => {
      const loadUserName = async () => {
        try {
          const savedName = await AsyncStorage.getItem(PROFILE_NOME_KEY);
          if (savedName !== null) {
            setUserName(savedName);
          }
        } catch (e) { console.error("Falha ao carregar o nome do usuário", e); }
      };
      loadUserName();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            
            <TouchableOpacity style={styles.headerProfile} onPress={() => router.push({ pathname: '/perfil' as any })}>
              <FontAwesome5 name="user-circle" size={28} color="white" />
              <Text style={styles.headerName}>{userName}</Text>
            </TouchableOpacity>

            <Ionicons name="menu" size={32} color="white" />
          </View>
          <Text style={styles.screenTitle}>Controle de Usuários</Text>
        </View>

        {/* Card da Lista de Usuários */}
        <View style={styles.listCard}>
          <View style={styles.listHeader}>
            <Text style={styles.headerColStatus}>Status</Text>
            <Text style={styles.headerColNome}>Nome</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert("Adicionar", "Lógica para adicionar novo usuário")}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={usersData}
            renderItem={({ item }) => <UserItem item={item} />}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F2F5' },
  container: { flex: 1, backgroundColor: '#F0F2F5', paddingBottom: 70, },
  header: { backgroundColor: '#0A4A8E', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', },
  headerProfile: { flexDirection: 'row', alignItems: 'center', },
  headerName: { color: 'white', fontSize: 18, marginLeft: 10, fontWeight: 'bold', },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: 20, },
  listCard: { flex: 1, marginHorizontal: 20, marginTop: -25, zIndex: 2, backgroundColor: 'white', borderRadius: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, overflow: 'hidden', },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', },
  headerColStatus: { color: '#a0a0a0', fontWeight: 'bold', fontSize: 14, width: 60, },
  headerColNome: { color: '#a0a0a0', fontWeight: 'bold', fontSize: 14, flex: 1, },
  addButton: { backgroundColor: '#1E63B0', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', },
  listItemContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20, },
  statusContainer: {
    width: 60, 
    alignItems: 'flex-start',
  },
  statusIndicator: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
  },
  statusActive: { backgroundColor: 'green', },
  statusInactive: { backgroundColor: 'gray', },
  userNameText: { flex: 1, fontSize: 16, color: '#333', fontWeight: '500', },
  verMaisText: { color: '#1E63B0', fontWeight: 'bold', fontSize: 14, },
  separator: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 20, },
});