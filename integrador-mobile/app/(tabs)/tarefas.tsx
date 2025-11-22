import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Image
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useProfileImage } from '../../context/ProfileImageContext';
import taskService from '../../services/task.service';
import type { Task, TaskStatus, TaskPriority } from '../../types/task.types';

const TarefaItemRow = ({ 
  item, 
  onEdit, 
  onDelete, 
  isAdmin 
}: { 
  item: Task; 
  onEdit: (id: number) => void; 
  onDelete: (id: number, titulo: string) => void;
  isAdmin: boolean;
}) => {
  const getStatusColor = () => {
    switch (item.status) {
      case 'PENDENTE': return '#ff8c00';
      case 'EM_ANDAMENTO': return '#4CAF50';
      case 'CONCLUIDA': return '#2196F3';
      case 'CANCELADA': return '#F44336';
      default: return '#999';
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'PENDENTE': return 'Pendente';
      case 'EM_ANDAMENTO': return 'Em Andamento';
      case 'CONCLUIDA': return 'Concluída';
      case 'CANCELADA': return 'Cancelada';
      default: return status;
    }
  };

  const getPrioridadeColor = () => {
    switch (item.prioridade) {
      case 'BAIXA': return '#4CAF50';
      case 'MEDIA': return '#FFC107';
      case 'ALTA': return '#FF9800';
      case 'URGENTE': return '#F44336';
      default: return '#999';
    }
  };

  const getPrioridadeLabel = (prioridade: TaskPriority) => {
    switch (prioridade) {
      case 'BAIXA': return 'Baixa';
      case 'MEDIA': return 'Média';
      case 'ALTA': return 'Alta';
      case 'URGENTE': return 'Urgente';
      default: return prioridade;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <View style={styles.listItemContainer}>
      <View style={styles.statusCell}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusBadgeText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>
      <Text style={[styles.cellText, styles.tituloCell]}>{item.titulo}</Text>
      <Text style={[styles.cellText, styles.responsavelCell]}>{item.responsavel}</Text>
      <Text style={[styles.cellText, styles.prioridadeCell, { color: getPrioridadeColor() }]}>
        {getPrioridadeLabel(item.prioridade)}
      </Text>
      <Text style={[styles.cellText, styles.criacaoCell]}>{formatDate(item.dataCriacao)}</Text>
      
      {isAdmin && (
        <View style={styles.actionCell}>
          <TouchableOpacity 
            onPress={() => item.id && onEdit(item.id)} 
            style={styles.actionButton}
          >
            <FontAwesome5 name="pencil-alt" size={18} color="#1E63B0" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => item.id && onDelete(item.id, item.titulo)} 
            style={styles.actionButton}
          >
            <FontAwesome5 name="trash-alt" size={18} color="#F44336" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function TarefasScreen() {
  const { user } = useAuth();
  const { profileImage } = useProfileImage();
  
  const [userName, setUserName] = useState("Usuário");
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [tarefas, setTarefas] = useState<Task[]>([]);
  const [filteredData, setFilteredData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Detecta se é admin e configura nome do usuário
  useEffect(() => {
    if (user?.username) {
      setUserName(user.username);
    }
    if (user?.roles) {
      const hasAdminRole = user.roles.some(role => role.name === 'ROLE_ADMIN');
      setIsAdmin(hasAdminRole);
      console.log('👤 Usuário é admin?', hasAdminRole);
    }
  }, [user]);

  // Carrega tarefas quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      loadTarefas();
    }, [])
  );

  // Filtro de pesquisa
  useEffect(() => {
    if (searchText === '') {
      setFilteredData(tarefas);
    } else {
      const searchLower = searchText.toLowerCase();
      setFilteredData(
        tarefas.filter(item =>
          item.titulo.toLowerCase().includes(searchLower) ||
          item.responsavel.toLowerCase().includes(searchLower) ||
          item.status.toLowerCase().includes(searchLower) ||
          item.prioridade.toLowerCase().includes(searchLower)
        )
      );
    }
  }, [searchText, tarefas]);

  const loadTarefas = async () => {
    try {
      setLoading(true);
      console.log('📋 Carregando tarefas...');
      
      const data = await taskService.getAllTasks();
      setTarefas(data);
      setFilteredData(data);
      
      console.log(`✅ ${data.length} tarefas carregadas`);
    } catch (error: any) {
      console.error('❌ Erro ao carregar tarefas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as tarefas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTarefas();
  }, []);

  const handleCreateTask = () => {
    if (!isAdmin) {
      Alert.alert('Acesso Negado', 'Apenas administradores podem criar tarefas');
      return;
    }
    router.push('/modal-tarefa' as any);
  };

  const handleEditTask = (id: number) => {
    if (!isAdmin) {
      Alert.alert('Acesso Negado', 'Apenas administradores podem editar tarefas');
      return;
    }
    router.push({
      pathname: '/modal-tarefa' as any,
      params: { id: id.toString() }
    });
  };

  const handleDeleteTask = (id: number, titulo: string) => {
    if (!isAdmin) {
      Alert.alert('Acesso Negado', 'Apenas administradores podem deletar tarefas');
      return;
    }

    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a tarefa "${titulo}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await taskService.deleteTask(id);
              Alert.alert('✅ Sucesso', 'Tarefa excluída com sucesso');
              loadTarefas();
            } catch (error: any) {
              console.error('❌ Erro ao excluir tarefa:', error);
              Alert.alert('❌ Erro', 'Não foi possível excluir a tarefa');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.headerProfile} onPress={() => router.push({ pathname: '/perfil' as any })}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <FontAwesome5 name="user-circle" size={28} color="white" />
              )}
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
          
          {isAdmin && (
            <TouchableOpacity 
              style={styles.createTaskButton} 
              onPress={handleCreateTask}
            >
              <Ionicons name="add" size={18} color="white" />
              <Text style={styles.createTaskText}>Criar Tarefa</Text>
            </TouchableOpacity>
          )}
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
          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text style={styles.loadingText}>Carregando tarefas...</Text>
            </View>
          ) : filteredData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="clipboard-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                {searchText ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa cadastrada'}
              </Text>
            </View>
          ) : (
            <ScrollView horizontal>
              <View>
                {/* Cabeçalho da Lista */}
                <View style={styles.listHeader}>
                  <Text style={[styles.headerText, styles.statusCell]}>Status</Text>
                  <Text style={[styles.headerText, styles.tituloCell]}>Título</Text>
                  <Text style={[styles.headerText, styles.responsavelCell]}>Responsável</Text>
                  <Text style={[styles.headerText, styles.prioridadeCell]}>Prioridade</Text>
                  <Text style={[styles.headerText, styles.criacaoCell]}>Criação</Text>
                  {isAdmin && (
                    <Text style={[styles.headerText, styles.actionCell]}>Ações</Text>
                  )}
                </View>

                {/* Lista */}
                <FlatList
                  data={filteredData}
                  renderItem={({ item }) => (
                    <TarefaItemRow 
                      item={item}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      isAdmin={isAdmin}
                    />
                  )}
                  keyExtractor={item => (item.id || Math.random()).toString()}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  nestedScrollEnabled={true}
                  scrollEnabled={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      colors={['#4A90E2']}
                    />
                  }
                />
              </View>
            </ScrollView>
          )}
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
  actionCell: { width: 100, justifyContent: 'center', alignItems: 'center', },
  separator: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 10, },
  
  avatarImage: { width: 28, height: 28, borderRadius: 14 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 },
  loadingText: { marginTop: 12, fontSize: 14, color: '#888' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 },
  emptyText: { marginTop: 12, fontSize: 16, color: '#888' },
  actionButton: { padding: 8, marginHorizontal: 4 },
});