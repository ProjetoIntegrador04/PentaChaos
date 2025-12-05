import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import userService from '../../services/user.service';
import { User } from '../../types/auth.types';

export default function UsuariosScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os usuários');
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await userService.toggleUserStatus(userId);
      Alert.alert('Sucesso', `Usuário ${currentStatus ? 'desativado' : 'ativado'} com sucesso`);
      loadUsers();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar o status do usuário');
      console.error('Erro ao alterar status:', error);
    }
  };

  const handleEditUser = (userId: number) => {
    router.push({
      pathname: '/editarUsuarioModal',
      params: { userId: userId.toString() },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0A4A8E" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gerenciar Usuários</Text>
        <Text style={styles.subtitle}>{users.length} usuário(s) cadastrado(s)</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <View style={styles.userHeader}>
                <Text style={styles.userName}>{item.fullName}</Text>
                <View style={[styles.statusBadge, item.enabled ? styles.activeStatus : styles.inactiveStatus]}>
                  <Text style={[styles.statusText, item.enabled ? styles.activeText : styles.inactiveText]}>
                    {item.enabled ? 'ATIVO' : 'INATIVO'}
                  </Text>
                </View>
              </View>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={styles.userDetail}>RA: {item.ra || 'N/A'}</Text>
              <Text style={styles.userDetail}>Squad: {item.squad || 'Sem squad'}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditUser(item.id)}
              >
                <Ionicons name="pencil" size={20} color="#0A4A8E" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => handleToggleStatus(item.id, item.enabled)}
              >
                <Ionicons
                  name={item.enabled ? 'power' : 'power-outline'}
                  size={20}
                  color={item.enabled ? '#4CAF50' : '#999'}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#0A4A8E',
    padding: 20,
    paddingBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#B8D4F1',
  },
  listContent: {
    padding: 15,
  },
  userCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: '#E8F5E9',
  },
  inactiveStatus: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeText: {
    color: '#2E7D32',
  },
  inactiveText: {
    color: '#C62828',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userDetail: {
    fontSize: 13,
    color: '#999',
    marginBottom: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 8,
  },
  toggleButton: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
  },
});
