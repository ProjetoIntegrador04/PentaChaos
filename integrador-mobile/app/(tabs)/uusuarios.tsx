import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, ScrollView, TextInput, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { usePerfilModal } from '../../context/PerfilModalContext';
import { useProfileImage } from '../../context/ProfileImageContext';
import userService from '../../services/user.service';

// --- TIPO PARA UM ITEM DA LISTA ---
type UserType = {
  id: string | number;
  username: string;
  fullName?: string;
  enabled: boolean;
  email: string;
  ra?: string;
  squad?: string;
};

// --- COMPONENTE PARA RENDERIZAR CADA LINHA ---
const UserItemRow = ({ item, onToggleStatus, isAdmin }: { item: UserType; onToggleStatus: (id: string | number) => void; isAdmin: boolean }) => {
  const displayName = item.fullName || item.username;
  const statusText = item.enabled ? 'ATIVO' : 'INATIVO';
  
  return (
    <View style={styles.listItemContainer}>
      <Text style={[styles.cellText, styles.statusCell, item.enabled ? styles.statusActive : styles.statusInactive]}>
        {statusText}
      </Text>
      <Text style={[styles.cellText, styles.nameCell]}>{displayName}</Text>
      <Text style={[styles.cellText, styles.emailCell]}>{item.email}</Text>
      <Text style={[styles.cellText, styles.raCell]}>{item.ra || '-'}</Text>
      <Text style={[styles.cellText, styles.squadCell]}>{item.squad || '-'}</Text>
      <View style={styles.actionCell}>
        {isAdmin ? (
          <>
            <TouchableOpacity onPress={() => router.push({ pathname: '/userDetail' as any, params: { userId: item.id } })} style={{ marginRight: 15 }}>
              <FontAwesome5 name="pencil-alt" size={18} color="#1E63B0" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onToggleStatus(item.id)}>
              <Ionicons name="power" size={22} color={item.enabled ? 'red' : 'gray'} />
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.noActionText}>-</Text>
        )}
      </View>
    </View>
  );
};

// --- TELA PRINCIPAL ---
export default function UserControlScreen() {
  const { user } = useAuth();
  const { openModal } = usePerfilModal();
  const { profileImage } = useProfileImage();
  const [userName, setUserName] = useState("Usuário");
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [usersData, setUsersData] = useState<UserType[]>([]);
  const [filteredData, setFilteredData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setUserName(user.username);
    }
    // Verifica se o usuário tem role ADMIN
    if (user?.roles) {
      const hasAdminRole = user.roles.some(role => role.name === 'ROLE_ADMIN');
      setIsAdmin(hasAdminRole);
      
      // Se não for admin, mostrar aviso e não carregar dados
      if (!hasAdminRole) {
        Alert.alert(
          'Acesso Negado', 
          'Apenas coordenadores podem acessar o controle de usuários.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    }
  }, [user]);

  // Carregar dados do backend
  const loadUsers = useCallback(async () => {
    // Só carrega se for ADMIN
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const users = await userService.getAllUsers();
      setUsersData(users);
      setFilteredData(users);
    } catch (error: any) {
      console.error('❌ Erro ao carregar usuários:', error);
      
      // Se for erro 403 (Forbidden), significa que não tem permissão
      if (error.response?.status === 403) {
        Alert.alert('Acesso Negado', 'Você não tem permissão para visualizar usuários.');
        router.back();
      } else {
        Alert.alert('Erro', 'Não foi possível carregar a lista de usuários.');
      }
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Recarregar dados (pull to refresh)
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  // Toggle status do usuário
  const handleToggleStatus = async (userId: string | number) => {
    try {
      const userToToggle = usersData.find(u => u.id === userId);
      if (!userToToggle) return;

      const newStatus = userToToggle.enabled ? 'desativado' : 'ativado';
      Alert.alert(
        'Confirmar',
        `Deseja ${newStatus === 'desativado' ? 'desativar' : 'ativar'} o usuário ${userToToggle.fullName || userToToggle.username}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Confirmar',
            onPress: async () => {
              try {
                await userService.toggleUserStatus(Number(userId));
                Alert.alert('Sucesso', `Usuário ${newStatus} com sucesso!`);
                await loadUsers(); // Recarregar lista
              } catch (error) {
                console.error('❌ Erro ao alterar status:', error);
                Alert.alert('Erro', 'Não foi possível alterar o status do usuário.');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('❌ Erro:', error);
    }
  };

  // Carregar dados ao montar o componente (apenas se for ADMIN)
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Lógica de pesquisa
  useEffect(() => {
    if (searchText === '') {
      setFilteredData(usersData);
    } else {
      const lowerCaseSearch = searchText.toLowerCase();
      setFilteredData(
        usersData.filter(item => {
          const displayName = (item.fullName || item.username).toLowerCase();
          return (
            displayName.includes(lowerCaseSearch) ||
            item.email.toLowerCase().includes(lowerCaseSearch) ||
            (item.ra && item.ra.toLowerCase().includes(lowerCaseSearch)) ||
            (item.squad && item.squad.toLowerCase().includes(lowerCaseSearch))
          );
        })
      );
    }
  }, [searchText, usersData]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.headerProfile} onPress={openModal}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileAvatar} />
              ) : (
                <FontAwesome5 name="user-circle" size={28} color="white" />
              )}
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
          {isAdmin && (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.reportButton}>
                <Ionicons name="download-outline" size={18} color="#1E63B0" />
                <Text style={styles.reportButtonText}>Gerar relatório</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.createButton} onPress={() => router.push('/cadastrarUsuarioModal')}>
                <Ionicons name="add" size={18} color="white" />
                <Text style={styles.createButtonText}>Cadastrar usuário</Text>
              </TouchableOpacity>
            </View>
          )}
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
              {loading ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#1E63B0" />
                  <Text style={{ marginTop: 10, color: '#666' }}>Carregando usuários...</Text>
                </View>
              ) : !isAdmin ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <Ionicons name="lock-closed" size={48} color="#999" />
                  <Text style={{ marginTop: 15, color: '#666', fontSize: 16, textAlign: 'center' }}>
                    Acesso restrito a coordenadores
                  </Text>
                </View>
              ) : filteredData.length === 0 ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <Text style={{ color: '#666', fontSize: 16 }}>Nenhum usuário encontrado.</Text>
                </View>
              ) : (
                <FlatList
                  data={filteredData}
                  renderItem={({ item }) => <UserItemRow item={item} onToggleStatus={handleToggleStatus} isAdmin={isAdmin} />}
                  keyExtractor={item => String(item.id)}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                  }
                />
              )}
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
  profileAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'white',
  },
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
  noActionText: { color: '#ccc', fontSize: 14 },
  separator: { height: 1, backgroundColor: '#f0f0f0', },
});