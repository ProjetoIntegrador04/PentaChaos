/**
 * Menu Lateral (Drawer)
 * Menu deslizante com opções de navegação e perfil
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useProfileImage } from '../context/ProfileImageContext';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  icon: string;
  iconType: 'ionicons' | 'fontawesome';
  label: string;
  route?: string;
  onPress?: () => void;
  color?: string;
  divider?: boolean;
}

export default function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const { user, signOut } = useAuth();
  const { profileImage } = useProfileImage();
  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
      router.replace('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'home',
      icon: 'home',
      iconType: 'ionicons',
      label: 'Dashboard',
      route: '/(tabs)/home',
    },
    {
      id: 'squads',
      icon: 'people',
      iconType: 'ionicons',
      label: 'Squads',
      route: '/(tabs)/squads',
    },
    {
      id: 'usuarios',
      icon: 'person',
      iconType: 'ionicons',
      label: 'Usuários',
      route: '/(tabs)/usuarios',
    },
    {
      id: 'clockentry',
      icon: 'time',
      iconType: 'ionicons',
      label: 'Registro de Ponto',
      route: '/clockentry',
    },
    {
      id: 'divider1',
      icon: '',
      iconType: 'ionicons',
      label: '',
      divider: true,
    },
    {
      id: 'notifications',
      icon: 'notifications',
      iconType: 'ionicons',
      label: 'Notificações',
      route: '/notificacoes',
    },
    {
      id: 'profile',
      icon: 'person-circle',
      iconType: 'ionicons',
      label: 'Meu Perfil',
      onPress: () => {
        onClose();
        // Abrir modal de perfil
      },
    },
    {
      id: 'divider2',
      icon: '',
      iconType: 'ionicons',
      label: '',
      divider: true,
    },
    {
      id: 'settings',
      icon: 'settings',
      iconType: 'ionicons',
      label: 'Configurações',
      color: '#666',
    },
    {
      id: 'help',
      icon: 'help-circle',
      iconType: 'ionicons',
      label: 'Ajuda',
      color: '#666',
    },
  ];

  const handleMenuItemPress = (item: MenuItem) => {
    if (item.onPress) {
      item.onPress();
    } else if (item.route) {
      onClose();
      router.push(item.route as any);
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    if (item.divider) {
      return <View key={item.id} style={styles.divider} />;
    }

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.menuItem}
        onPress={() => handleMenuItemPress(item)}
      >
        <View style={styles.menuItemContent}>
          {item.iconType === 'ionicons' ? (
            <Ionicons name={item.icon as any} size={24} color={item.color || '#0A4A8E'} />
          ) : (
            <FontAwesome5 name={item.icon} size={20} color={item.color || '#0A4A8E'} />
          )}
          <Text style={[styles.menuItemText, item.color && { color: item.color }]}>
            {item.label}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View
          style={[
            styles.drawer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          {/* Header do Drawer */}
          <View style={styles.drawerHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.profileSection}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <FontAwesome5 name="user" size={40} color="#fff" />
                </View>
              )}
              <Text style={styles.profileName}>{user?.username || 'Usuário'}</Text>
              <Text style={styles.profileEmail}>{user?.email || ''}</Text>
            </View>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.menuContainer}>
            {menuItems.map(renderMenuItem)}
          </ScrollView>

          {/* Footer com Logout */}
          <View style={styles.drawerFooter}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out" size={24} color="#d32f2f" />
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
            <Text style={styles.version}>Versão 1.0.0</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  drawer: {
    width: DRAWER_WIDTH,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 16,
  },
  drawerHeader: {
    backgroundColor: '#0A4A8E',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 12,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
    marginHorizontal: 20,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: '600',
  },
  version: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
  },
});
