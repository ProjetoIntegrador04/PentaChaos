import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Switch } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import userService from '../services/user.service';

export default function EditarUsuarioModal() {
  const params = useLocalSearchParams();
  const userId = params.userId as string;

  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [ra, setRa] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [squad, setSquad] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carregar dados do usuário
  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const user = await userService.getUserById(Number(userId));
      
      setNome(user.fullName || '');
      setUsername(user.username || '');
      setRa(user.ra || '');
      setEmail(user.email || '');
      setTelefone(user.phoneNumber || '');
      setSquad(user.squad || '');
      setEnabled(user.enabled || false);
      
      // Verifica se tem role ADMIN
      if (user.roles) {
        setIsAdmin(user.roles.some((r: any) => r.name === 'ROLE_ADMIN'));
      }
    } catch (error: any) {
      console.error('❌ Erro ao carregar usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    // Validações
    if (!username || !email) {
      Alert.alert("Erro", "Username e Email são obrigatórios!");
      return;
    }

    setSaving(true);

    try {
      // Atualiza o usuário no backend
      await userService.updateUser(Number(userId), {
        username: username.trim(),
        email: email.trim(),
        fullName: nome.trim() || undefined,
        ra: ra.trim() || undefined,
        phoneNumber: telefone.trim() || undefined,
        squad: squad.trim() || undefined,
        enabled: enabled,
      });

      Alert.alert("Sucesso!", "Usuário atualizado com sucesso.", [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error("❌ Erro ao atualizar:", error);
      
      let errorMessage = "Erro ao atualizar usuário.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ presentation: 'modal', headerShown: false }} />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#0A4A8E" />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ presentation: 'modal', headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Editar Usuário</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#555" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.formContainer} 
          contentContainerStyle={styles.formContent} 
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Username (Login) *</Text>
          <TextInput 
            style={[styles.input, styles.inputDisabled]} 
            value={username} 
            editable={false}
            autoCapitalize="none"
          />
          <Text style={styles.helperText}>Username não pode ser alterado</Text>

          <Text style={styles.label}>Nome Completo</Text>
          <TextInput 
            style={styles.input} 
            value={nome} 
            onChangeText={setNome}
            placeholder="Ex: João Silva"
          />

          <Text style={styles.label}>Matrícula (RA)</Text>
          <TextInput 
            style={styles.input} 
            value={ra} 
            onChangeText={setRa} 
            keyboardType="numeric"
            placeholder="Ex: 123456"
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="usuario@email.com"
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput 
            style={styles.input} 
            value={telefone} 
            onChangeText={setTelefone}
            keyboardType="phone-pad"
            placeholder="(11) 98765-4321"
          />

          <Text style={styles.label}>Squad</Text>
          <TextInput 
            style={styles.input} 
            value={squad} 
            onChangeText={setSquad}
            placeholder="Ex: Squad LSD"
          />

          <View style={styles.switchContainer}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Status do Usuário</Text>
              <View style={styles.switchWithLabel}>
                <Text style={[styles.statusText, !enabled && styles.statusInactive]}>
                  {enabled ? 'ATIVO' : 'INATIVO'}
                </Text>
                <Switch
                  value={enabled}
                  onValueChange={setEnabled}
                  trackColor={{ false: '#ccc', true: '#34C759' }}
                  thumbColor={enabled ? '#fff' : '#f4f3f4'}
                />
              </View>
            </View>
          </View>

          {isAdmin && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#0A4A8E" />
              <Text style={styles.adminBadgeText}>Este usuário é Coordenador</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => router.back()}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
              onPress={handleSalvar}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  switchContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: 'column',
  },
  switchWithLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#10B981',
  },
  statusInactive: {
    color: '#EF4444',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  adminBadgeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#0A4A8E',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#0A4A8E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
