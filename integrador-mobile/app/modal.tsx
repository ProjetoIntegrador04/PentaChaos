import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, Platform, ScrollView } from 'react-native'; 
import { router } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; 

export default function NovaTarefaModal() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState<'PENDENTE' | 'EM ANDAMENTO' | 'CONCLUÍDO'>('PENDENTE');
  const [prioridade, setPrioridade] = useState<'Baixa' | 'Media' | 'Alta'>('Media');
  const [responsavel, setResponsavel] = useState('');

  const handleSalvar = () => {
    console.log({ titulo, descricao, status, prioridade, responsavel });
    Alert.alert("Tarefa Salva", "A nova tarefa foi criada com sucesso.");
    router.back(); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho do Modal */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nova Tarefa</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#555" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.formContainer}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descricao}
            onChangeText={setDescricao}
            multiline={true}
            numberOfLines={4}
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={status}
                  onValueChange={(itemValue) => setStatus(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Pendente" value="PENDENTE" />
                  <Picker.Item label="Em Andamento" value="EM ANDAMENTO" />
                  <Picker.Item label="Concluído" value="CONCLUÍDO" />
                </Picker>
              </View>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Prioridade</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={prioridade}
                  onValueChange={(itemValue) => setPrioridade(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Baixa" value="Baixa" />
                  <Picker.Item label="Média" value="Media" />
                  <Picker.Item label="Alta" value="Alta" />
                </Picker>
              </View>
            </View>
          </View>

          <Text style={styles.label}>Responsável</Text>
          <TextInput
            style={styles.input}
            value={responsavel}
            onChangeText={setResponsavel}
          />
        </ScrollView>

        {/* Botões de Ação */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#f9f9f9' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0A4A8E' },
  closeButton: { padding: 5 },
  
  formContainer: { 
    flex: 1,
  },
  formContent: { 
    padding: 20,
    paddingBottom: 40,
  },
  
  label: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 8, marginTop: 15 },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 50, 
  },
  textArea: { 
    height: 100, 
    textAlignVertical: 'top' 
  },
  row: { 
    flexDirection: 'row', 
    gap: 15 
  },
  column: { 
    flex: 1 
  },

  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 50, 
    justifyContent: 'center', 
  },
  picker: {
    width: '100%',
    height: '100%',
    color: '#333',
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        border: 'none',
        outline: 'none',
      },
      ios: {
        height: 'auto',
      }
    })
  },
  
  footer: { flexDirection: 'row', justifyContent: 'flex-end', padding: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  cancelButton: { backgroundColor: 'white', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 20, marginRight: 10 },
  cancelButtonText: { color: '#555', fontWeight: 'bold', fontSize: 16 },
  saveButton: { backgroundColor: '#1E63B0', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 20 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});