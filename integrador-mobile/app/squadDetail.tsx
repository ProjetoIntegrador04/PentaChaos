import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Alert,
  ActivityIndicator, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import squadService from '../services/squad.service';
import userService from '../services/user.service';
import { Squad } from '../types/squad.types';
import { User } from '../types/auth.types';
import { useAuth } from '../context/AuthContext';

export default function SquadDetailScreen() {
  const { squadId, squadName } = useLocalSearchParams();
  const { user: currentUser } = useAuth();
  const [squad, setSquad] = useState<Squad | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    if (currentUser?.roles) {
      const hasAdminRole = currentUser.roles.some((role: any) => role.name === 'ROLE_ADMIN');
      setIsAdmin(hasAdminRole);
    }
  }, [currentUser]);

  useEffect(() => {
    loadSquadDetails();
    if (isAdmin) {
      loadAllUsers();
    }
  }, [squadId]);

  const loadSquadDetails = async () => {
    try {
      setLoading(true);
      const data = await squadService.getSquadById(Number(squadId));
      setSquad(data);
    } catch (error: any) {
      console.error('❌ Erro ao carregar squad:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do squad');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const users = await userService.getAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error('❌ Erro ao carregar usuários:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSquadDetails();
    setRefreshing(false);
  };

  const handleAddMember = () => {
    if (!isAdmin) {
      Alert.alert('Acesso Negado', 'Apenas coordenadores podem adicionar membros');
      return;
    }

    // Filtrar usuários que não estão no squad
    const availableUsers = allUsers.filter(
      u => !squad?.members.some(m => m.id === u.id)
    );

    if (availableUsers.length === 0) {
      Alert.alert('Aviso', 'Todos os usuários já estão no squad');
      return;
    }

    // Criar lista de opções para o Alert
    const userOptions = availableUsers.map(u => ({
      text: `${u.username} ${u.fullName ? `(${u.fullName})` : ''}`,
      onPress: () => confirmAddMember(u.id, u.username)
    }));

    Alert.alert(
      'Adicionar Membro',
      'Selecione um usuário para adicionar ao squad:',
      [
        ...userOptions.slice(0, 5), // Limitar a 5 por vez
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const confirmAddMember = async (userId: number, username: string) => {
    try {
      await squadService.addMember(Number(squadId), { userId });
      Alert.alert('Sucesso', `${username} foi adicionado ao squad`);
      loadSquadDetails();
    } catch (error: any) {
      console.error('❌ Erro ao adicionar membro:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o membro');
    }
  };

  const handleRemoveMember = (userId: number, username: string) => {
    if (!isAdmin) {
      Alert.alert('Acesso Negado', 'Apenas coordenadores podem remover membros');
      return;
    }

    Alert.alert(
      'Confirmar Remoção',
      `Deseja remover ${username} do squad?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await squadService.removeMember(Number(squadId), userId);
              Alert.alert('Sucesso', `${username} foi removido do squad`);
              loadSquadDetails();
            } catch (error: any) {
              console.error('❌ Erro ao remover membro:', error);
              Alert.alert('Erro', 'Não foi possível remover o membro');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A4A8E" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!squad) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text>Squad não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{squad.name}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.squadName}>{squad.name}</Text>
          {squad.description && (
            <Text style={styles.description}>{squad.description}</Text>
          )}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={24} color="#0A4A8E" />
              <Text style={styles.statValue}>{squad.memberCount}</Text>
              <Text style={styles.statLabel}>Membros</Text>
            </View>
          </View>
        </View>

        {/* Members List */}
        <View style={styles.membersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Membros</Text>
            {isAdmin && (
              <TouchableOpacity onPress={handleAddMember} style={styles.addMemberButton}>
                <Ionicons name="add-circle" size={28} color="#0A4A8E" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={squad.members}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.memberItem}>
                <View style={styles.memberAvatar}>
                  <Ionicons name="person" size={24} color="#0A4A8E" />
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>
                    {item.fullName || item.username}
                  </Text>
                  <Text style={styles.memberEmail}>{item.email}</Text>
                </View>
                {isAdmin && (
                  <TouchableOpacity
                    onPress={() => handleRemoveMember(item.id, item.username)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF4444" />
                  </TouchableOpacity>
                )}
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={48} color="#999" />
                <Text style={styles.emptyText}>Nenhum membro no squad</Text>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#0A4A8E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  squadName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A4A8E',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  membersSection: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addMemberButton: {
    padding: 5,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginBottom: 10,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E9F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  memberEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    padding: 5,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 15,
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});
