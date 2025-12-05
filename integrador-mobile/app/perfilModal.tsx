import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Modal, ScrollView, 
  Image, TouchableOpacity, Alert, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { useProfileImage } from '../context/ProfileImageContext';

// Chaves para AsyncStorage
const PROFILE_BIO_KEY = 'profile_bio';
const PROFILE_PHONE_KEY = 'profile_phone';
const PROFILE_RA_KEY = 'profile_ra';

interface PerfilModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PerfilModal({ visible, onClose }: PerfilModalProps) {
  const { user, logout } = useAuth();
  const { profileImage, setProfileImage } = useProfileImage();
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Dados do backend (user context)
  const [username] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [fullName, setFullName] = useState(user?.fullName || "");
  
  // Dados locais (AsyncStorage)
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ra, setRa] = useState("");

  // Carregar dados do contexto
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setFullName(user.fullName || "");
      setPhoneNumber(user.phoneNumber || "");
      setRa(user.ra || "");
    }
  }, [user]);

  // Carregar dados salvos localmente
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedBio = await AsyncStorage.getItem(PROFILE_BIO_KEY);
        if (savedBio) setBio(savedBio);
        
        const savedPhone = await AsyncStorage.getItem(PROFILE_PHONE_KEY);
        if (savedPhone) setPhoneNumber(savedPhone);
        
        const savedRa = await AsyncStorage.getItem(PROFILE_RA_KEY);
        if (savedRa) setRa(savedRa);
      } catch (e) {
        console.error("Falha ao carregar dados do perfil", e);
      }
    };
    
    if (visible) {
      loadProfileData();
    }
  }, [visible]);

  // Escolher imagem
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permissão necessária", 
        "É preciso permitir o acesso à galeria para alterar a foto."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const sourceUri = result.assets[0].uri;
      
      try {
        // Context já cuida de salvar no AsyncStorage
        await setProfileImage(sourceUri);
        Alert.alert("Sucesso", "Foto atualizada!");
      } catch (e: any) {
        console.error("Falha ao salvar imagem:", e.message);
        Alert.alert("Erro", "Não foi possível salvar a imagem.");
      }
    }
  };

  // Salvar alterações
  const handleSaveChanges = async () => {
    try {
      // Salvar dados locais
      await AsyncStorage.setItem(PROFILE_BIO_KEY, bio);
      await AsyncStorage.setItem(PROFILE_PHONE_KEY, phoneNumber);
      await AsyncStorage.setItem(PROFILE_RA_KEY, ra);
      
      // TODO: Chamar API para atualizar email, fullName no backend
      // await userService.updateProfile({ email, fullName, phoneNumber, ra });
      
      Alert.alert("Sucesso", "Perfil atualizado!");
      setIsEditing(false);
    } catch (e) {
      console.error("Falha ao salvar dados", e);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Deseja realmente sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: () => {
            logout();
            onClose();
          }
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Meu Perfil</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#0A4A8E" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Foto de perfil */}
            <View style={styles.photoContainer}>
              <View style={styles.photoWrapper}>
                <Image
                  source={
                    profileImage 
                      ? { uri: profileImage } 
                      : require('../assets/images/icon.png')
                  }
                  style={styles.profileImage}
                />
                <TouchableOpacity 
                  style={styles.cameraButton} 
                  onPress={pickImage}
                >
                  <Ionicons name="camera" size={20} color="white" />
                </TouchableOpacity>
              </View>
              <Text style={styles.username}>@{username}</Text>
              {user?.roles && user.roles.length > 0 && (
                <View style={styles.roleContainer}>
                  <Ionicons 
                    name={
                      user.roles.some(r => r.name === 'ROLE_ADMIN') 
                        ? "shield-checkmark" 
                        : "person"
                    } 
                    size={16} 
                    color="#0A4A8E" 
                  />
                  <Text style={styles.roleText}>
                    {user.roles.some(r => r.name === 'ROLE_ADMIN') 
                      ? 'Coordenador' 
                      : 'Membro'}
                  </Text>
                </View>
              )}
            </View>

            {/* Formulário */}
            <View style={styles.form}>
              {/* Nome Completo */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={fullName}
                  onChangeText={setFullName}
                  editable={isEditing}
                  placeholder="Seu nome completo"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Email */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={email}
                  onChangeText={setEmail}
                  editable={isEditing}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="seu@email.com"
                  placeholderTextColor="#999"
                />
              </View>

              {/* RA */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Matrícula (RA)</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={ra}
                  onChangeText={setRa}
                  editable={isEditing}
                  keyboardType="numeric"
                  placeholder="000000"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Telefone */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  editable={isEditing}
                  keyboardType="phone-pad"
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Bio/Descrição */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Sobre mim</Text>
                <TextInput
                  style={[
                    styles.input, 
                    styles.textArea,
                    !isEditing && styles.inputDisabled
                  ]}
                  value={bio}
                  onChangeText={setBio}
                  editable={isEditing}
                  multiline
                  numberOfLines={4}
                  placeholder="Conte um pouco sobre você..."
                  placeholderTextColor="#999"
                  textAlignVertical="top"
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer com botões */}
          <View style={styles.footer}>
            {isEditing ? (
              <>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveChanges}
                >
                  <Ionicons name="checkmark" size={20} color="white" />
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={20} color="#dc3545" />
                  <Text style={styles.logoutButtonText}>Sair</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Ionicons name="pencil" size={20} color="white" />
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A4A8E',
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 10,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  photoWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#E3F2FD',
    backgroundColor: '#f0f0f0',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0A4A8E',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 5,
  },
  roleText: {
    color: '#0A4A8E',
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    gap: 15,
  },
  fieldContainer: {
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A4A8E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#666',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#0A4A8E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flex: 1,
    backgroundColor: '#FFF5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dc3545',
    gap: 8,
  },
  logoutButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
