import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function CadastrarUsuarioModal() {
  const [nome, setNome] = useState('');
  const [ra, setRa] = useState('');
  const [squad, setSquad] = useState('');
  const [emailCorp, setEmailCorp] = useState('');
  const [emailPessoal, setEmailPessoal] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleSalvar = () => {
    // --- DIAGNÓSTICO 1 ---
    console.log("--- BOTÃO SALVAR (USUÁRIO) CLICADO ---"); // Verifica se a função foi chamada

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }
    
    console.log({ nome, ra, squad, emailCorp, emailPessoal, senha });
    Alert.alert("Usuário Salvo", "O novo usuário foi cadastrado com sucesso.");
    router.back(); // Fecha o modal
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
          <Text style={styles.label}>Nome Completo *</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} />
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Matrícula (RA) *</Text>
              <TextInput style={styles.input} value={ra} onChangeText={setRa} keyboardType="numeric" />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Squad *</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={squad} onValueChange={(itemValue) => setSquad(itemValue)} style={styles.picker}>
                  <Picker.Item label="Selecione..." value="" />
                  <Picker.Item label="CASE" value="CASE" />
                  <Picker.Item label="LSD" value="LSD" />
                  <Picker.Item label="INFRA" value="INFRA" />
                  <Picker.Item label="404" value="404" />
                  <Picker.Item label="Alpha" value="Alpha" />
                </Picker>
              </View>
            </View>
          </View>
          <Text style={styles.label}>Email Corporativo *</Text>
          <TextInput style={styles.input} value={emailCorp} onChangeText={setEmailCorp} keyboardType="email-address" />
          <Text style={styles.label}>Email Pessoal</Text>
          <TextInput style={styles.input} value={emailPessoal} onChangeText={setEmailPessoal} keyboardType="email-address" />
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Senha *</Text>
              <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Confirmar Senha *</Text>
              <TextInput style={styles.input} value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Sair</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
            <Ionicons name="checkmark" size={16} color="white" />
            <Text style={styles.saveButtonText}>Salvar</Text>
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
  cancelButton: { backgroundColor: 'white', borderWidth: 1, borderColor: '#F44336', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 25, marginRight: 10, },
  cancelButtonText: { color: '#F44336', fontWeight: 'bold', fontSize: 16, },
  saveButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E63B0', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 25, },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8, },
});