import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import squadService from '../services/squad.service';
import userService from '../services/user.service';
import { User } from '../types/auth.types';

interface CadastrarSquadModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CadastrarSquadModal({ visible, onClose, onSuccess }: CadastrarSquadModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Carrega usuários quando o modal abre
  useEffect(() => {
    if (visible) {
      loadUsers();
    }
  }, [visible]);

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
    if (!name.trim()) {
      Alert.alert('Erro', 'Nome do squad é obrigatório');
      return;
    }

    if (name.trim().length < 3) {
      Alert.alert('Erro', 'Nome deve ter no mínimo 3 caracteres');
      return;
    }

    try {
      setLoading(true);
      
      // Cria o squad
      const newSquad = await squadService.createSquad({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      // Adiciona os membros selecionados ao squad
      if (selectedMembers.length > 0) {
        for (const userId of selectedMembers) {
          try {
            await squadService.addMember(newSquad.id, { userId });
          } catch (error) {
            console.error(`⚠️ Erro ao adicionar membro ${userId}:`, error);
          }
        }
      }

      Alert.alert('Sucesso', `Squad criado com ${selectedMembers.length} membro(s)!`);
      handleCloseAndReset();
      onSuccess();
    } catch (error: any) {
      console.error('❌ Erro ao criar squad:', error);
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível criar o squad'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAndReset = () => {
    setName('');
    setDescription('');
    setSelectedMembers([]);
    setSearchTerm('');
    onClose();
  };

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
            <Text style={styles.modalTitle}>Novo Squad</Text>
            <TouchableOpacity onPress={handleCloseAndReset} disabled={loading}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>Nome do Squad *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Squad LSD"
              value={name}
              onChangeText={setName}
              editable={!loading}
              maxLength={50}
            />

            <Text style={styles.label}>Descrição (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrição do squad..."
              value={description}
              onChangeText={setDescription}
              editable={!loading}
              multiline
              numberOfLines={4}
              maxLength={500}
            />

            {/* Seção de Membros com Checklist */}
            <Text style={styles.label}>
              Estagiários ({selectedMembers.length} selecionados)
            </Text>

            {loadingUsers ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0A4A8E" />
                <Text style={styles.loadingText}>Carregando usuários...</Text>
              </View>
            ) : (
              <>
                {/* Campo de busca */}
                {allUsers.length > 5 && (
                  <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Buscar por nome, email ou RA..."
                      value={searchTerm}
                      onChangeText={setSearchTerm}
                      editable={!loading}
                    />
                  </View>
                )}

                {/* Botões de seleção */}
                <View style={styles.selectionButtons}>
                  <TouchableOpacity
                    style={styles.selectionButton}
                    onPress={handleSelectAll}
                    disabled={loading}
                  >
                    <Text style={styles.selectionButtonText}>
                      Selecionar Todos ({allUsers.length})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.selectionButton}
                    onPress={handleDeselectAll}
                    disabled={loading}
                  >
                    <Text style={styles.selectionButtonText}>Limpar</Text>
                  </TouchableOpacity>
                </View>

                {/* Lista de checkboxes */}
                <View style={styles.checkboxContainer}>
                  {allUsers.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Ionicons name="alert-circle-outline" size={48} color="#d32f2f" />
                      <Text style={styles.emptyStateTitle}>Nenhum estagiário encontrado</Text>
                      <Text style={styles.emptyStateText}>
                        Certifique-se de que há usuários com ROLE_USER cadastrados
                      </Text>
                    </View>
                  ) : filteredUsers.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Ionicons name="search-outline" size={48} color="#666" />
                      <Text style={styles.emptyStateText}>
                        Nenhum estagiário encontrado com &quot;{searchTerm}&quot;
                      </Text>
                    </View>
                  ) : (
                    filteredUsers.map(user => {
                      const isSelected = selectedMembers.includes(user.id);
                      return (
                        <TouchableOpacity
                          key={user.id}
                          style={[
                            styles.checkboxItem,
                            isSelected && styles.checkboxItemSelected
                          ]}
                          onPress={() => handleToggleMember(user.id)}
                          disabled={loading}
                        >
                          <View style={styles.checkbox}>
                            {isSelected && (
                              <Ionicons name="checkmark" size={18} color="#0A4A8E" />
                            )}
                          </View>
                          <View style={styles.userInfo}>
                            <Text style={styles.userName}>{user.username}</Text>
                            <Text style={styles.userDetails}>
                              {user.email}
                              {user.ra && ` • RA: ${user.ra}`}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })
                  )}
                </View>
              </>
            )}
          </ScrollView>

          {/* Botões fixos no rodapé */}
          <View style={styles.modalFooter}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCloseAndReset}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.submitButton, loading && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Criando...' : 'Criar Squad'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalFooter: {
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#0A4A8E',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
  },
  selectionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  selectionButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectionButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  checkboxContainer: {
    maxHeight: 280,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    padding: 10,
    marginBottom: 16,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  checkboxItemSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#0A4A8E',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#0A4A8E',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userDetails: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});
