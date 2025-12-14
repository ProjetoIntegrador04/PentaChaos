import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import taskService from '../services/task.service';
import userService from '../services/user.service';
import type { TaskStatus, TaskPriority, TaskCreateRequest } from '../types/task.types';
import type { User } from '../types/auth.types';

export default function ModalTarefaScreen() {
  const params = useLocalSearchParams();
  const taskId = params.id ? Number(params.id) : null;
  const isEditMode = !!taskId;
  const readOnly = params.readOnly === 'true'; // User tem acesso limitado

  // Form states
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState<TaskStatus>('PENDENTE');
  const [prioridade, setPrioridade] = useState<TaskPriority>('MEDIA');
  const [responsavel, setResponsavel] = useState('');
  const [dataConclusao, setDataConclusao] = useState('');

  // UI states
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Carregar usuários disponíveis
  useEffect(() => {
    loadUsuarios();
    if (isEditMode) {
      loadTask();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoadingUsers(true);
      const users = await userService.getAllUsers();
      setUsuarios(users);
      console.log(`📋 ${users.length} usuários carregados`);
    } catch (error: any) {
      console.error('❌ Erro ao carregar usuários:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de usuários');
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadTask = async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      const task = await taskService.getTaskById(taskId);
      
      setTitulo(task.titulo);
      setDescricao(task.descricao);
      setStatus(task.status);
      setPrioridade(task.prioridade);
      
      // Extrai o ID do responsável (pode ser objeto ou string)
      if (typeof task.responsavel === 'object' && task.responsavel?.id) {
        setResponsavel(task.responsavel.id.toString());
      } else if (typeof task.responsavel === 'string') {
        setResponsavel(task.responsavel);
      }
      
      // Converte data do backend (YYYY-MM-DD) para formato de exibição (DD/MM/YYYY)
      if (task.dataConclusao) {
        setDataConclusao(convertDateToDisplayFormat(task.dataConclusao));
      } else {
        setDataConclusao('');
      }
      
      console.log('✅ Tarefa carregada para edição', readOnly ? '(Modo Limitado)' : '(Modo Completo)');
    } catch (error: any) {
      console.error('❌ Erro ao carregar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da tarefa');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Se modo readOnly, apenas valida o status (sempre válido)
    if (readOnly) {
      return true;
    }

    if (!titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    } else if (titulo.length < 3) {
      newErrors.titulo = 'Título deve ter pelo menos 3 caracteres';
    }

    if (!descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (descricao.length < 10) {
      newErrors.descricao = 'Descrição deve ter pelo menos 10 caracteres';
    }

    if (!responsavel) {
      newErrors.responsavel = 'Selecione um responsável';
    }

    // Validação de data (formato DD/MM/YYYY)
    if (dataConclusao) {
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(dataConclusao)) {
        newErrors.dataConclusao = 'Data inválida (use: DD/MM/AAAA)';
      } else {
        // Verifica se a data é válida
        const [day, month, year] = dataConclusao.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
          newErrors.dataConclusao = 'Data inválida';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Converte data de DD/MM/YYYY para YYYY-MM-DD (formato backend)
   */
  const convertDateToBackendFormat = (dateStr: string): string | undefined => {
    if (!dateStr) return undefined;
    
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dateStr)) return undefined;
    
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  /**
   * Converte data de YYYY-MM-DD para DD/MM/YYYY (formato exibição)
   */
  const convertDateToDisplayFormat = (dateStr: string): string => {
    if (!dateStr) return '';
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) return dateStr;
    
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  /**
   * Aplica máscara de data DD/MM/YYYY
   */
  const handleDateChange = (text: string) => {
    // Remove tudo que não é número
    let cleaned = text.replace(/\D/g, '');
    
    // Aplica a máscara
    if (cleaned.length >= 5) {
      cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4) + '/' + cleaned.substring(4, 8);
    } else if (cleaned.length >= 3) {
      cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    
    setDataConclusao(cleaned);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Converte data para formato do backend (YYYY-MM-DD)
      const dataBackend = convertDateToBackendFormat(dataConclusao);

      if (isEditMode && taskId) {
        // Modo readOnly: apenas atualiza o status
        if (readOnly) {
          await taskService.updateTask(taskId, {
            status,
          });
          Alert.alert('✅ Sucesso', 'Status da tarefa atualizado!');
        } else {
          // Admin: atualiza tudo
          await taskService.updateTask(taskId, {
            titulo,
            descricao,
            status,
            prioridade,
            responsavel: { id: Number(responsavel) }, // Envia como objeto com id
            dataConclusao: dataBackend,
          });
          Alert.alert('✅ Sucesso', 'Tarefa atualizada com sucesso!');
        }
      } else {
        // Criar nova tarefa (apenas admin)
        const newTask: TaskCreateRequest = {
          titulo,
          descricao,
          status,
          prioridade,
          responsavel: { id: Number(responsavel) }, // Envia como objeto com id
          dataConclusao: dataBackend,
        };

        await taskService.createTask(newTask);
        
        Alert.alert('✅ Sucesso', 'Tarefa criada com sucesso!');
      }

      router.back();
    } catch (error: any) {
      console.error('❌ Erro ao salvar tarefa:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao salvar tarefa';
      Alert.alert('❌ Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading || loadingUsers) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E63B0" />
          <Text style={styles.loadingText}>
            {loadingUsers ? 'Carregando usuários...' : 'Carregando...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {readOnly ? 'Atualizar Status' : isEditMode ? 'Editar Tarefa' : 'Nova Tarefa'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {readOnly && (
              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color="#1E63B0" />
                <Text style={styles.infoText}>
                  Você pode atualizar apenas o status da tarefa
                </Text>
              </View>
            )}

            {/* Título */}
            {!readOnly ? (
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Título <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.titulo && styles.inputError]}
                  placeholder="Digite o título da tarefa"
                  value={titulo}
                  onChangeText={setTitulo}
                  maxLength={100}
                />
                {errors.titulo && <Text style={styles.errorText}>{errors.titulo}</Text>}
              </View>
            ) : (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Título:</Text>
                <Text style={styles.readOnlyText}>{titulo}</Text>
              </View>
            )}

            {/* Descrição */}
            {!readOnly ? (
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Descrição <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textArea, errors.descricao && styles.inputError]}
                  placeholder="Descreva a tarefa em detalhes"
                  value={descricao}
                  onChangeText={setDescricao}
                multiline
                numberOfLines={4}
                maxLength={500}
              />
              {errors.descricao && <Text style={styles.errorText}>{errors.descricao}</Text>}
            </View>
            ) : (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Descrição:</Text>
                <Text style={styles.readOnlyText}>{descricao}</Text>
              </View>
            )}

            {/* Status */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Status {readOnly && <Text style={styles.required}>*</Text>}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={status}
                  onValueChange={(value) => setStatus(value as TaskStatus)}
                  style={styles.picker}
                >
                  <Picker.Item label="⏳ Pendente" value="PENDENTE" />
                  <Picker.Item label="🔄 Em Andamento" value="EM_ANDAMENTO" />
                  <Picker.Item label="✅ Concluída" value="CONCLUIDA" />
                  <Picker.Item label="❌ Cancelada" value="CANCELADA" />
                </Picker>
              </View>
            </View>

            {/* Prioridade */}
            {!readOnly && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Prioridade</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={prioridade}
                    onValueChange={(value) => setPrioridade(value as TaskPriority)}
                    style={styles.picker}
                  >
                    <Picker.Item label="🟢 Baixa" value="BAIXA" />
                    <Picker.Item label="🟡 Média" value="MEDIA" />
                    <Picker.Item label="🟠 Alta" value="ALTA" />
                    <Picker.Item label="🔴 Urgente" value="URGENTE" />
                  </Picker>
                </View>
              </View>
            )}

            {/* Responsável */}
            {!readOnly && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Responsável <Text style={styles.required}>*</Text>
                </Text>
              <View style={[styles.pickerContainer, errors.responsavel && styles.inputError]}>
                <Picker
                  selectedValue={responsavel}
                  onValueChange={(value) => setResponsavel(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione um usuário..." value="" />
                  {usuarios.map((user) => (
                    <Picker.Item
                      key={user.id}
                      label={`${user.username} (${user.email})`}
                      value={user.id.toString()}
                    />
                  ))}
                </Picker>
              </View>
              {errors.responsavel && <Text style={styles.errorText}>{errors.responsavel}</Text>}
            </View>
            )}

            {/* Data de Conclusão (Opcional) */}
            {!readOnly && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Data de Conclusão (Opcional)</Text>
                <TextInput
                  style={[styles.input, errors.dataConclusao && styles.inputError]}
                  placeholder="DD/MM/AAAA (ex: 31/12/2025)"
                  value={dataConclusao}
                  onChangeText={handleDateChange}
                  maxLength={10}
                  keyboardType="numeric"
                />
                {errors.dataConclusao && <Text style={styles.errorText}>{errors.dataConclusao}</Text>}
                <Text style={styles.helperText}>Formato: DD/MM/AAAA</Text>
              </View>
            )}

            {/* Botões */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={20} color="white" />
                    <Text style={styles.saveButtonText}>
                      {isEditMode ? 'Atualizar' : 'Criar Tarefa'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1E63B0',
  },
  formGroup: {
    marginBottom: 20,
  },
  readOnlyText: {
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#F44336',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#1E63B0',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
