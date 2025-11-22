import React from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { usePerfilModal } from '../../context/PerfilModalContext';
import { useProfileImage } from '../../context/ProfileImageContext';

export default function UsuariosScreen() {
  const { user } = useAuth();
  const { openModal } = usePerfilModal();
  const { profileImage } = useProfileImage();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>
      
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.profileCard}
          onPress={openModal}
          activeOpacity={0.7}
        >
          <View style={styles.profileHeader}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.avatar}
              />
            ) : (
              <Image
                source={require('../../assets/images/icon.png')}
                style={styles.avatar}
              />
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user?.fullName || user?.username || 'Usuário'}</Text>
              <Text style={styles.email}>{user?.email}</Text>
              {user?.roles && user.roles.length > 0 && (
                <View style={styles.badge}>
                  <Ionicons 
                    name={
                      user.roles.some(r => r.name === 'ROLE_ADMIN') 
                        ? "shield-checkmark" 
                        : "person"
                    } 
                    size={14} 
                    color="#0A4A8E" 
                  />
                  <Text style={styles.badgeText}>
                    {user.roles.some(r => r.name === 'ROLE_ADMIN') 
                      ? 'Coordenador' 
                      : 'Membro'}
                  </Text>
                </View>
              )}
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </View>
          
          <View style={styles.actionHint}>
            <Ionicons name="hand-left" size={16} color="#0A4A8E" />
            <Text style={styles.hintText}>Toque para ver e editar seu perfil completo</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Ionicons name="mail" size={24} color="#0A4A8E" />
            <Text style={styles.infoCardLabel}>Email</Text>
            <Text style={styles.infoCardValue}>{user?.email || 'Não informado'}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="call" size={24} color="#0A4A8E" />
            <Text style={styles.infoCardLabel}>Telefone</Text>
            <Text style={styles.infoCardValue}>{user?.phoneNumber || 'Não informado'}</Text>
          </View>
        </View>

        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Ionicons name="card" size={24} color="#0A4A8E" />
            <Text style={styles.infoCardLabel}>Matrícula</Text>
            <Text style={styles.infoCardValue}>{user?.ra || 'Não informado'}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="people" size={24} color="#0A4A8E" />
            <Text style={styles.infoCardLabel}>Squad</Text>
            <Text style={styles.infoCardValue}>{user?.squad || 'Sem squad'}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    backgroundColor: '#0A4A8E',
    paddingVertical: 20,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E3F2FD',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 5,
  },
  badgeText: {
    fontSize: 12,
    color: '#0A4A8E',
    fontWeight: '600',
  },
  actionHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 8,
  },
  hintText: {
    fontSize: 13,
    color: '#0A4A8E',
    fontWeight: '500',
  },
  infoCards: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoCardLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '600',
  },
  infoCardValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});