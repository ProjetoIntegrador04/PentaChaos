import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_NOME_KEY = 'profile_nome';

type TarefaType = {
  id: string;
  status: 'PENDENTE' | 'EM ANDAMENTO';
  titulo: string;
  responsavel: string;
  prioridade: 'Alta' | 'Media' | 'Baixa';
  criacao: string;
};

const taskData: TarefaType[] = [
  { id: '1', status: 'PENDENTE', titulo: 'Criar módulo backend', responsavel: 'David Francisco', prioridade: 'Alta', criacao: '2025-10-27' },
  { id: '2', status: 'EM ANDAMENTO', titulo: 'Atualizar módulo backend', responsavel: 'Ana Clara', prioridade: 'Alta', criacao: '2025-10-26' },
  { id: '3', status: 'EM ANDAMENTO', titulo: 'Testar deploy', responsavel: 'Lucas Souza', prioridade: 'Media', criacao: '2025-10-25' },
  { id: '4', status: 'PENDENTE', titulo: 'Documentar API', responsavel: 'Ana Clara', prioridade: 'Baixa', criacao: '2025-10-27' },
];

const TarefaItemRow = ({ item }: { item: TarefaType }) => {
  const getStatusColor = () => (item.status === 'PENDENTE' ? '#ff8c00' : '#4CAF50'); 
  const getPrioridadeColor = () => {
    if (item.prioridade === 'Alta') return '#F44336'; 
    if (item.prioridade === 'Media') return '#FFC107'; 
    return '#4CAF50'; 
  };

  return (
    <View style={styles.listItemContainer}>
      <View style={styles.statusCell}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusBadgeText}>{item.status}</Text>
        </View>
      </View>
      <Text style={[styles.cellText, styles.tituloCell]}>{item.titulo}</Text>
      <Text style={[styles.cellText, styles.responsavelCell]}>{item.responsavel}</Text>
      <Text style={[styles.cellText, styles.prioridadeCell, { color: getPrioridadeColor() }]}>{item.prioridade}</Text>
      <Text style={[styles.cellText, styles.criacaoCell]}>{item.criacao}</Text>
      <View style={styles.actionCell}>
        <TouchableOpacity onPress={() => Alert.alert('Ação', `Editar ${item.titulo}`)}>
          <FontAwesome5 name="pencil-alt" size={18} color="#1E63B0" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- TELA PRINCIPAL ---
export default function TarefasScreen() {
  const [userName, setUserName] = useState("Marcelo");
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(taskData);

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
      setFilteredData(taskData);
    } else {
      setFilteredData(
        taskData.filter(item =>
          item.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
          item.responsavel.toLowerCase().includes(searchText.toLowerCase())
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
            
            {/* Ícones da Direita: Notificações e Menu */}
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

        <View style={styles.contentHeader}>
          <Text style={styles.screenTitle}>Gerenciador de Tarefas</Text>
          
          <TouchableOpacity 
            style={styles.createTaskButton} 
            onPress={() => router.push('/modal' as any)}
          >
            <Ionicons name="add" size={18} color="white" />
            <Text style={styles.createTaskText}>Criar Tarefa</Text>
          </TouchableOpacity>
        </View>

        {/* Barra de Pesquisa */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar por título, responsável ou status..."
            placeholderTextColor="#ccc"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Card da Lista de Tarefas */}
        <View style={styles.listCard}>
          <ScrollView horizontal>
            <View>
              {/* Cabeçalho da Lista */}
              <View style={styles.listHeader}>
                <Text style={[styles.headerText, styles.statusCell]}>Status</Text>
                <Text style={[styles.headerText, styles.tituloCell]}>Título</Text>
                <Text style={[styles.headerText, styles.responsavelCell]}>Responsável</Text>
                <Text style={[styles.headerText, styles.prioridadeCell]}>Prioridade</Text>
                <Text style={[styles.headerText, styles.criacaoCell]}>Criação</Text>
                <Text style={[styles.headerText, styles.actionCell]}>Ações</Text>
              </View>

              {/* Lista */}
              <FlatList
                data={filteredData}
                renderItem={({ item }) => <TarefaItemRow item={item} />}
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F2F5' },
  container: { flex: 1, backgroundColor: '#F0F2F5', paddingBottom: 70 },
  header: { backgroundColor: '#0A4A8E', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  headerProfile: { flexDirection: 'row', alignItems: 'center' },
  headerName: { color: 'white', fontSize: 18, marginLeft: 10, fontWeight: 'bold' },
  headerIconsContainer: { flexDirection: 'row', alignItems: 'center' },
  notificationDot: { position: 'absolute', top: 0, right: 15, width: 10, height: 10, borderRadius: 5, backgroundColor: 'red', borderWidth: 1, borderColor: 'white' },
  
  contentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 25, },
  screenTitle: { fontSize: 24, fontWeight: 'bold', color: '#0A4A8E', },
  createTaskButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E63B0', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 15, },
  createTaskText: { color: 'white', fontWeight: 'bold', fontSize: 14, marginLeft: 8, },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 15, marginHorizontal: 15, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, },
  searchIcon: { marginRight: 10, },
  searchInput: { flex: 1, height: 50, fontSize: 16, color: '#333', },
  
  listCard: { flex: 1, marginHorizontal: 15, backgroundColor: 'white', borderRadius: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, overflow: 'hidden', },
  listHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fafafa', },
  headerText: { color: '#a0a0a0', fontWeight: 'bold', fontSize: 12, },
  listItemContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15, },
  cellText: { fontSize: 14, color: '#333', },
  
  statusCell: { width: 120, },
  statusBadge: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10, alignSelf: 'flex-start', },
  statusBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', },
  tituloCell: { width: 200, fontWeight: '500', },
  responsavelCell: { width: 100, },
  prioridadeCell: { width: 80, fontWeight: 'bold', },
  criacaoCell: { width: 100, },
  actionCell: { width: 60, justifyContent: 'center', alignItems: 'center', },
  separator: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 10, },
});