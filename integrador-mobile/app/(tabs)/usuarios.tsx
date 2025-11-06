import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, 
  Image, TouchableOpacity, Alert, TextInput, Platform
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- CHAVES PARA O ASYNCSTORAGE ---
const PROFILE_IMAGE_KEY = 'my-profile-image-uri';
const PROFILE_NOME_KEY = 'profile_nome';
const PROFILE_SOBRENOME_KEY = 'profile_sobrenome';
const PROFILE_EMAIL_KEY = 'profile_email';
const PROFILE_NASCIMENTO_KEY = 'profile_nascimento';
const PROFILE_CARGO_KEY = 'profile_cargo';
const PROFILE_GITHUB_KEY = 'profile_github';
const PROFILE_LINKEDIN_KEY = 'profile_linkedin';

// Componente InfoField
const InfoField = ({ 
  label, value, isEditing, onChangeText 
}: { 
  label: string, value: string, isEditing: boolean, onChangeText: (text: string) => void 
}) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={[styles.fieldValueContainer, isEditing && styles.fieldValueEditing]}>
      {isEditing ? (
        <TextInput style={styles.fieldInput} value={value} onChangeText={onChangeText} />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  </View>
);

export default function UsuariosScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState("Marcelo ribeiro");
  const [sobrenome, setSobrenome] = useState("Rodrigues");
  const [email, setEmail] = useState("marcelindosmagos@gmail.com");
  const [nascimento, setNascimento] = useState("01/01/2001");
  const [cargo, setCargo] = useState("UI/UX Designer");
  const [github, setGithub] = useState("Github.com/marcelindosmagos");
  const [linkedin, setLinkedin] = useState("Linked.in/marcelindosmagos");

  // Carregar dados
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedImageUri = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
        if (savedImageUri) setProfileImage(savedImageUri);
        const savedNome = await AsyncStorage.getItem(PROFILE_NOME_KEY);
        if (savedNome) setNome(savedNome);
        const savedSobrenome = await AsyncStorage.getItem(PROFILE_SOBRENOME_KEY);
        if (savedSobrenome) setSobrenome(savedSobrenome);
        const savedEmail = await AsyncStorage.getItem(PROFILE_EMAIL_KEY);
        if (savedEmail) setEmail(savedEmail);
        const savedNascimento = await AsyncStorage.getItem(PROFILE_NASCIMENTO_KEY);
        if (savedNascimento) setNascimento(savedNascimento);
        const savedCargo = await AsyncStorage.getItem(PROFILE_CARGO_KEY);
        if (savedCargo) setCargo(savedCargo);
        const savedGithub = await AsyncStorage.getItem(PROFILE_GITHUB_KEY);
        if (savedGithub) setGithub(savedGithub);
        const savedLinkedin = await AsyncStorage.getItem(PROFILE_LINKEDIN_KEY);
        if (savedLinkedin) setLinkedin(savedLinkedin);
      } catch (e) { console.error("Falha ao carregar os dados do perfil", e); }
    };
    loadProfileData(); 
  }, []);

  // Escolher imagem
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "É preciso permitir o acesso à galeria para alterar a foto.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 1,
    });
    if (!result.canceled) {
      const sourceUri = result.assets[0].uri;
      try {
        // @ts-ignore
        const docDir = FileSystem.documentDirectory;
        if (!docDir) throw new Error("Diretório não encontrado.");
        const filename = sourceUri.split('/').pop() || `profile_image_${Date.now()}.jpg`;
        const newUri = docDir + filename;
        await FileSystem.copyAsync({ from: sourceUri, to: newUri });
        setProfileImage(newUri);
        await AsyncStorage.setItem(PROFILE_IMAGE_KEY, newUri);
      } catch (e: any) { console.error("Falha ao salvar a imagem:", e.message); Alert.alert("Erro", "Não foi possível salvar a imagem."); }
    }
  };

  // Salvar alterações
  const handleSaveChanges = async () => {
    try {
      await AsyncStorage.setItem(PROFILE_NOME_KEY, nome);
      await AsyncStorage.setItem(PROFILE_SOBRENOME_KEY, sobrenome);
      await AsyncStorage.setItem(PROFILE_EMAIL_KEY, email);
      await AsyncStorage.setItem(PROFILE_NASCIMENTO_KEY, nascimento);
      await AsyncStorage.setItem(PROFILE_CARGO_KEY, cargo);
      await AsyncStorage.setItem(PROFILE_GITHUB_KEY, github);
      await AsyncStorage.setItem(PROFILE_LINKEDIN_KEY, linkedin);
      Alert.alert("Sucesso", "Informações atualizadas!");
      setIsEditing(false);
    } catch (e) { console.error("Falha ao salvar os dados do perfil", e); Alert.alert("Erro", "Não foi possível salvar."); }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../../assets/images/icon.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editPhotoContainer} onPress={pickImage}>
            <Text style={styles.editPhotoText}>Alterar foto</Text>
            <FontAwesome5 name="pencil-alt" size={14} color="#555" />
          </TouchableOpacity>
          {isEditing ? (
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <FontAwesome5 name="check" size={16} color="white" />
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <FontAwesome5 name="pencil-alt" size={16} color="#0A4A8E" />
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          )}
          <InfoField label="NOME" value={nome} isEditing={isEditing} onChangeText={setNome} />
          <InfoField label="SOBRENOME" value={sobrenome} isEditing={isEditing} onChangeText={setSobrenome} />
          <InfoField label="EMAIL" value={email} isEditing={isEditing} onChangeText={setEmail} />
          <InfoField label="DATA DE NASCIMENTO" value={nascimento} isEditing={isEditing} onChangeText={setNascimento} />
          <InfoField label="CARGO" value={cargo} isEditing={isEditing} onChangeText={setCargo} />
          <InfoField label="GITHUB" value={github} isEditing={isEditing} onChangeText={setGithub} />
          <InfoField label="LINKEDIN" value={linkedin} isEditing={isEditing} onChangeText={setLinkedin} />
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>SENHA</Text>
            <TouchableOpacity style={styles.passwordButton}>
              <Text style={styles.passwordButtonText}>Alterar Senha</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A4A8E', },
  header: { backgroundColor: '#0A4A8E', paddingVertical: 20, paddingTop: 50, alignItems: 'center', justifyContent: 'center', },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', },
  scrollContainer: { flexGrow: 1, backgroundColor: '#F0F2F5', paddingBottom: 80, },
  card: { backgroundColor: 'white', margin: 15, borderRadius: 20, padding: 20, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, marginTop: 20, },
  profileImage: { width: 140, height: 140, borderRadius: 70, borderWidth: 3, borderColor: '#eee', marginVertical: 10, backgroundColor: '#f0f0f0', },
  editPhotoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, },
  editPhotoText: { color: '#555', marginRight: 8, fontSize: 16, },
  editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, marginBottom: 20, },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A4A8E', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, marginBottom: 20, },
  editButtonText: { color: '#0A4A8E', fontWeight: 'bold', marginLeft: 8, fontSize: 16, },
  saveButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16, },
  fieldContainer: { width: '100%', marginBottom: 15, },
  fieldLabel: { color: '#0A4A8E', fontSize: 12, fontWeight: 'bold', marginBottom: 5, paddingLeft: 10, textTransform: 'uppercase', },
  fieldValueContainer: { backgroundColor: '#e7f0ff', borderRadius: 25, paddingHorizontal: 20, minHeight: 50, justifyContent: 'center' },
  fieldValue: { color: '#333', fontSize: 16, paddingVertical: 15, },
  fieldValueEditing: { backgroundColor: '#fff', borderColor: '#0A4A8E', borderWidth: 1, },
  fieldInput: { color: '#333', fontSize: 16, height: 50, },
  passwordButton: { backgroundColor: '#f0f0f0', borderRadius: 25, paddingVertical: 15, paddingHorizontal: 20, alignItems: 'center', },
  passwordButtonText: { color: '#333', fontSize: 16, fontWeight: 'bold', },
});