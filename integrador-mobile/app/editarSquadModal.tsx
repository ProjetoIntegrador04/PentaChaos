import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import squadService from '../services/squad.service';
import userService from '../services/user.service';
import { User } from '../types/auth.types';
import { Squad } from '../types/squad.types';

interface EditarSquadModalProps {
  visible: boolean;
  squad: Squad | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditarSquadModal({ visible, squad, onClose, onSuccess }: EditarSquadModalProps) {
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Carrega usuários e define membros selecionados quando o modal abre
  useEffect(() => {
    if (visible && squad) {
      loadUsers();
      // Define membros já existentes como selecionados
      const currentMemberIds = squad.members?.map(m => m.id) || [];
      setSelectedMembers(currentMemberIds);
    }
  }, [visible, squad]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const users = await userService.getAllUsers();
      // Filtra apenas usuários com ROLE_USER (estagiários)
      const interns = users.filter(user => 
        user.roles?.some(role => role.name === 'ROLE_USER')
      );
      setAllUsers(interns);
    } catch (error) {
      console.error('❌ Erro ao carregar usuários:', error);
      Alert.alert('Aviso', 'Não foi possível carregar a lista de usuários');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Filtra usuários pela busca
  const filteredUsers = allUsers.filter(user => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.ra?.toLowerCase().includes(term)
    );
  });

  const handleToggleMember = (userId: number) => {
    setSelectedMembers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      }
      return [...prev, userId];
    });
  };

  const handleSelectAll = () => {
    setSelectedMembers(allUsers.map(u => u.id));
  };

  const handleDeselectAll = () => {
    setSelectedMembers([]);
  };

  const handleSubmit = async () => {
    if (!squad) return;

    try {
      setLoading(true);
      
      // Membros atuais e novos
      const currentMemberIds = new Set(squad.members?.map(m => m.id) || []);
      const newMemberIds = new Set(selectedMembers);

      // Adicionar novos membros
      for (const userId of selectedMembers) {
        if (!currentMemberIds.has(userId)) {
          try {
            await squadService.addMember(squad.id, { userId });
            console.log(`✅ Membro ${userId} adicionado`);
          } catch (error) {
            console.error(`⚠️ Erro ao adicionar membro ${userId}:`, error);
          }
        }
      }

      // Remover membros que foram desmarcados
      for (const memberId of Array.from(currentMemberIds)) {
        if (!newMemberIds.has(memberId)) {
          try {
            await squadService.removeMember(squad.id, memberId);
            console.log(`✅ Membro ${memberId} removido`);
          } catch (error) {
            console.error(`⚠️ Erro ao remover membro ${memberId}:`, error);
          }
        }
      }

      Alert.alert('Sucesso', `Squad ${squad.name} atualizado!`);
      handleCloseAndReset();
      onSuccess();
    } catch (error: any) {
      console.error('❌ Erro ao editar squad:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível editar o squad'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAndReset = () => {
    setSelectedMembers([]);
    setSearchTerm('');
    onClose();
  };

  if (!squad) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseAndReset}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Squad: {squad.name}</Text>
            <TouchableOpacity onPress={handleCloseAndReset} disabled={loading}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.infoText}>
              Selecione ou desmarque os membros deste squad
            </Text>

            {/* Campo de busca */}
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nome, email ou RA..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />

            {/* Botões de seleção */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={handleSelectAll}
                disabled={loading}
              >
                <Text style={styles.buttonSecondaryText}>Selecionar Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={handleDeselectAll}
                disabled={loading}
              >
                <Text style={styles.buttonSecondaryText}>Limpar Seleção</Text>
              </TouchableOpacity>
            </View>

            {/* Lista de usuários */}
            {loadingUsers ? (
              <ActivityIndicator size="large" color="#1E63B0" style={{ marginTop: 20 }} />
            ) : (
              <View style={styles.userList}>
                {filteredUsers.map(user => (
                  <TouchableOpacity
                    key={user.id}
                    style={[
                      styles.userItem,
                      selectedMembers.includes(user.id) && styles.userItemSelected
                    ]}
                    onPress={() => handleToggleMember(user.id)}
                    disabled={loading}
                  >
                    <View style={styles.checkbox}>
                      {selectedMembers.includes(user.id) && (
                        <Ionicons name="checkmark" size={18} color="#1E63B0" />
                      )}
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{user.fullName || user.username}</Text>
                      <Text style={styles.userEmail}>{user.email}</Text>
                      {user.ra && <Text style={styles.userRa}>RA: {user.ra}</Text>}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Botões de ação */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={handleCloseAndReset}
                disabled={loading}
              >
                <Text style={styles.buttonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonPrimaryText}>Salvar Alterações</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  modalContent: {
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#f0f0f0',
  },
  buttonSecondaryText: {
    color: '#333',
    fontSize: 12,
  },
  buttonCancel: {
    backgroundColor: '#f0f0f0',
  },
  buttonCancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  buttonPrimary: {
    backgroundColor: '#1E63B0',
  },
  buttonPrimaryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userList: {
    marginBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  userItemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1E63B0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#1E63B0',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
  },
  userRa: {
    fontSize: 12,
    color: '#999',
  },
});
