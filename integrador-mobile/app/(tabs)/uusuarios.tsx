import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { Ionicons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_NOME_KEY = 'profile_nome';

// --- TIPO PARA UM ITEM DA LISTA ---
type UserType = {
  id: string;
  name: string;
  status: 'ATIVO' | 'INATIVO';
  email: string;
  ra: string;
  squad: string;
};

// --- DADOS DE EXEMPLO (MOCK) ---
const usersData: UserType[] = [
  { id: '1', name: 'David Franco', status: 'ATIVO', email: 'david.franco@email.com', ra: '554033', squad: 'CASE' },
  { id: '2', name: 'Maria Souza', status: 'ATIVO', email: 'maria.souza@email.com', ra: '778899', squad: 'CASE' },
  { id: '3', name: 'João Silva', status: 'INATIVO', email: 'joao.silva@email.com', ra: '112233', squad: 'LSD' },
  { id: '4', name: 'Thóris Medeiros', status: 'ATIVO', email: 'thoris.merds@email.com', ra: '778865', squad: 'LSD' },
  { id: '5', name: 'Carlos Eduardo', status: 'INATIVO', email: 'carlos.edu@email.com', ra: '112267', squad: 'INFRA' },
  { id: '6', name: 'Ana Clara', status: 'ATIVO', email: 'ana.clara@email.com', ra: '111111', squad: 'CASE' },
  { id: '7', name: 'Lucas Souza', status: 'ATIVO', email: 'lucas.souza@email.com', ra: '222222', squad: 'LSD' },
  { id: '8', name: 'Mariana Costa', status: 'ATIVO', email: 'mariana.costa@email.com', ra: '333333', squad: 'LSD' },
  { id: '9', name: 'Pedro Henrique', status: 'ATIVO', email: 'pedro.henrique@email.com', ra: '444444', squad: 'INFRA' },
  { id: '10', name: 'Juliana Silva', status: 'ATIVO', email: 'juliana.silva@email.com', ra: '555555', squad: 'Alpha' },
];

// --- COMPONENTE PARA RENDERIZAR CADA LINHA ---
const UserItemRow = ({ item }: { item: UserType }) => (
  <View style={styles.listItemContainer}>
    <Text style={[styles.cellText, styles.statusCell, item.status === 'ATIVO' ? styles.statusActive : styles.statusInactive]}>
      {item.status}
    </Text>
    <Text style={[styles.cellText, styles.nameCell]}>{item.name}</Text>
    <Text style={[styles.cellText, styles.emailCell]}>{item.email}</Text>
    <Text style={[styles.cellText, styles.raCell]}>{item.ra}</Text>
    <Text style={[styles.cellText, styles.squadCell]}>{item.squad}</Text>
    <View style={styles.actionCell}>
      <TouchableOpacity onPress={() => router.push({ pathname: '/userDetail' as any, params: { userId: item.id } })} style={{ marginRight: 15 }}>
        <FontAwesome5 name="pencil-alt" size={18} color="#1E63B0" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Alert.alert('Ação', `Alterar status de ${item.name}`)}>
        <Ionicons name="power" size={22} color={item.status === 'ATIVO' ? 'red' : 'gray'} />
      </TouchableOpacity>
    </View>
  </View>
);

// --- TELA PRINCIPAL ---
export default function UserControlScreen() {
  const [userName, setUserName] = useState("Marcelo");
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(usersData);

  // Carrega o nome do gestor
  useFocusEffect(
    React.useCallback(() => {
      const loadUserName = async () => {
        try {
          const savedName = await AsyncStorage.getItem(PROFILE_NOME_KEY);
          if (savedName !== null) { setUserName(savedName); }
        } catch (e) { console.error("Falha ao carregar o nome", e); }
      };
      loadUserName();
    }, [])
  );

  // Lógica de pesquisa
  useEffect(() => {
    if (searchText === '') {
      setFilteredData(usersData);
    } else {
      const lowerCaseSearch = searchText.toLowerCase();
      setFilteredData(
        usersData.filter(item =>
          item.name.toLowerCase().includes(lowerCaseSearch) ||
          item.email.toLowerCase().includes(lowerCaseSearch) ||
          item.ra.toLowerCase().includes(lowerCaseSearch) ||
          item.squad.toLowerCase().includes(lowerCaseSearch)
        )
      );
    }
  }, [searchText]);

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
            <View style={styles.headerIconsContainer}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/notificacoes' as any })}>
                <Ionicons name="notifications-outline" size={28} color="white" />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {/* Lógica do Menu */}}>
                <Ionicons name="menu" size={32} color="white" style={{ marginLeft: 15 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Corpo da Tela */}
        <View style={styles.contentHeader}>
          <Text style={styles.screenTitle}>Controle de Usuários</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.reportButton}>
              <Ionicons name="download-outline" size={18} color="#1E63B0" />
              <Text style={styles.reportButtonText}>Gerar relatório</Text>
            </TouchableOpacity>

            {/* --- A CORREÇÃO ESTÁ AQUI --- */}
            {/* O onPress agora navega para o novo modal */}
            <TouchableOpacity style={styles.createButton} onPress={() => router.push('/cadastrarUsuarioModal')}>
              <Ionicons name="add" size={18} color="white" />
              <Text style={styles.createButtonText}>Cadastrar usuário</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* Barra de Pesquisa */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquise por nome, email, RA ou squad..."
            placeholderTextColor="#ccc"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Card da Lista de Usuários */}
        <View style={styles.listCard}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Cabeçalho da Lista */}
              <View style={styles.listHeader}>
                <Text style={[styles.headerText, styles.statusCell]}>Status</Text>
                <Text style={[styles.headerText, styles.nameCell]}>Nome</Text>
                <Text style={[styles.headerText, styles.emailCell]}>Email</Text>
                <Text style={[styles.headerText, styles.raCell]}>RA</Text>
                <Text style={[styles.headerText, styles.squadCell]}>Squad</Text>
                <Text style={[styles.headerText, styles.actionCell]}>Ações</Text>
              </View>

              {/* Lista */}
              <FlatList
                data={filteredData}
                renderItem={({ item }) => <UserItemRow item={item} />}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F2F5' },
  container: { flex: 1, backgroundColor: '#F0F2F5', paddingBottom: 70 },
  header: { backgroundColor: '#0A4A8E', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  headerProfile: { flexDirection: 'row', alignItems: 'center' },
  headerName: { color: 'white', fontSize: 18, marginLeft: 10, fontWeight: 'bold' },
  headerIconsContainer: { flexDirection: 'row', alignItems: 'center' },
  notificationDot: { position: 'absolute', top: 0, right: 15, width: 10, height: 10, borderRadius: 5, backgroundColor: 'red', borderWidth: 1, borderColor: 'white' },
  
  contentHeader: {
    padding: 20,
    paddingTop: 25,
  },
  screenTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#0A4A8E',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: 'white', 
    borderWidth: 1, 
    borderColor: '#1E63B0', 
    borderRadius: 8, 
    paddingVertical: 12,
    paddingHorizontal: 10, 
    marginRight: 10,
  },
  reportButtonText: { color: '#1E63B0', fontWeight: 'bold', fontSize: 13, marginLeft: 8, },
  createButton: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#1E63B0', 
    borderRadius: 8, 
    paddingVertical: 12, 
    paddingHorizontal: 10, 
  },
  createButtonText: { color: 'white', fontWeight: 'bold', fontSize: 13, marginLeft: 8, },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 15, marginHorizontal: 15, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, },
  searchIcon: { marginRight: 10, },
  searchInput: { flex: 1, height: 50, fontSize: 16, color: '#333', },
  
  listCard: { flex: 1, marginHorizontal: 15, backgroundColor: 'white', borderRadius: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, overflow: 'hidden', },
  listHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fafafa', },
  headerText: { color: '#a0a0a0', fontWeight: 'bold', fontSize: 12, },
  listItemContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15, },
  cellText: { fontSize: 14, color: '#333', },
  
  statusCell: { width: 80, fontWeight: 'bold', textTransform: 'uppercase', paddingLeft: 5, },
  statusActive: { color: 'green', },
  statusInactive: { color: 'red', },
  nameCell: { width: 150, fontWeight: '500', },
  emailCell: { width: 200, },
  raCell: { width: 100, },
  squadCell: { width: 80, },
  actionCell: { width: 80, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
  separator: { height: 1, backgroundColor: '#f0f0f0', },
});