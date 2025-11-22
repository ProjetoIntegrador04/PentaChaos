import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, ScrollView, Platform, ActivityIndicator, Switch } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import authService from '../services/auth.service';

export default function CadastrarUsuarioModal() {
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState(''); // Username para login
  const [ra, setRa] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Flag para criar como ADMIN
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    console.log("--- BOTÃO SALVAR (USUÁRIO) CLICADO ---");

    // Validações
    if (!username || !email || !senha) {
      Alert.alert("Erro", "Preencha os campos obrigatórios: Username, Email e Senha");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }
    
    setLoading(true);

    try {
      // Chama o backend para registrar o usuário
      await authService.register({
        username: username.trim(),
        email: email.trim(),
        password: senha,
        fullName: nome.trim() || undefined,
        ra: ra.trim() || undefined,
        phoneNumber: telefone.trim() || undefined,
        isAdmin: isAdmin, // Envia flag de admin
      });

      Alert.alert("Sucesso!", "Usuário cadastrado com sucesso.");
      router.back(); // Fecha o modal
    } catch (error: any) {
      console.error("❌ Erro ao cadastrar:", error);
      
      let errorMessage = "Erro ao cadastrar usuário.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ presentation: 'modal', headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cadastrar Usuário</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#555" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Username (Login) *</Text>
          <TextInput 
            style={styles.input} 
            value={username} 
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholder="Ex: j.silva"
          />

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
            placeholder="Ex: joao.silva@example.com"
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput 
            style={styles.input} 
            value={telefone} 
            onChangeText={setTelefone} 
            keyboardType="phone-pad"
            placeholder="Ex: (11) 98765-4321"
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Senha *</Text>
              <TextInput 
                style={styles.input} 
                value={senha} 
                onChangeText={setSenha} 
                secureTextEntry
                placeholder="Min. 6 caracteres"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Confirmar Senha *</Text>
              <TextInput 
                style={styles.input} 
                value={confirmarSenha} 
                onChangeText={setConfirmarSenha} 
                secureTextEntry
                placeholder="Repita a senha"
              />
            </View>
          </View>

          <View style={styles.adminToggleContainer}>
            <View style={styles.adminToggleLabel}>
              <Ionicons name="shield-checkmark" size={20} color="#1E63B0" />
              <Text style={styles.adminToggleText}>Criar como Coordenador (Admin)</Text>
            </View>
            <Switch
              value={isAdmin}
              onValueChange={setIsAdmin}
              trackColor={{ false: '#767577', true: '#1E63B0' }}
              thumbColor={isAdmin ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Sair</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={handleSalvar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark" size={16} color="white" />
                <Text style={styles.saveButtonText}>Salvar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
// Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#f9f9f9', },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0A4A8E', },
  closeButton: { padding: 5 },
  formContainer: { flex: 1 },
  formContent: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 8, marginTop: 15, },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: '#333', minHeight: 50, },
  row: { flexDirection: 'row', gap: 15, },
  column: { flex: 1, },
  pickerContainer: { backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, height: 50, justifyContent: 'center', },
  picker: { width: '100%', height: '100%', color: '#333', backgroundColor: 'transparent', ...Platform.select({ web: { border: 'none', outline: 'none' }, }) },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', padding: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0', },
  adminToggleContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 15, 
    paddingHorizontal: 5,
    marginTop: 10,
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E63B0',
  },
  adminToggleLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adminToggleText: {
    fontSize: 15,
    color: '#0A4A8E',
    fontWeight: '600',
  },
  cancelButton: { backgroundColor: 'white', borderWidth: 1, borderColor: '#F44336', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 25, marginRight: 10, },
  cancelButtonText: { color: '#F44336', fontWeight: 'bold', fontSize: 16, },
  saveButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E63B0', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 25, },
  saveButtonDisabled: { backgroundColor: '#9db3c9', },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8, },
});