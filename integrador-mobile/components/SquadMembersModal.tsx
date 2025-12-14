/**
 * Modal de Membros da Squad
 * Exibe lista de membros quando squad é clicada no dashboard
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Squad } from '../types/squad.types';

interface SquadMembersModalProps {
  visible: boolean;
  squad: Squad | null;
  onClose: () => void;
}

export default function SquadMembersModal({ visible, squad, onClose }: SquadMembersModalProps) {
  if (!squad) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleContainer}>
              <FontAwesome5 name="users" size={24} color="#0A4A8E" />
              <Text style={styles.modalTitle}>{squad.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Squad Info */}
          <View style={styles.squadInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="people" size={20} color="#0A4A8E" />
              <Text style={styles.infoText}>
                {squad.memberCount} {squad.memberCount === 1 ? 'Membro' : 'Membros'}
              </Text>
            </View>
            {squad.description && (
              <Text style={styles.description}>{squad.description}</Text>
            )}
          </View>

          {/* Members List */}
          <ScrollView style={styles.membersList}>
            <Text style={styles.sectionTitle}>Membros:</Text>
            
            {squad.members && squad.members.length > 0 ? (
              squad.members.map((member, index) => (
                <View key={member.id} style={styles.memberCard}>
                  <View style={styles.memberIcon}>
                    <FontAwesome5 name="user" size={20} color="#0A4A8E" />
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.username}</Text>
                    <Text style={styles.memberEmail}>{member.email}</Text>
                    {member.ra && (
                      <Text style={styles.memberDetails}>RA: {member.ra}</Text>
                    )}
                    {member.squadRole && (
                      <View style={styles.roleTag}>
                        <Text style={styles.roleText}>{member.squadRole}</Text>
                      </View>
                    )}
                  </View>
                  {member.roles && member.roles.length > 0 && (
                    <View style={styles.roleBadge}>
                      <Ionicons 
                        name={member.roles.some(r => r.name === 'ROLE_ADMIN') ? 'shield-checkmark' : 'person'} 
                        size={16} 
                        color="#fff" 
                      />
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>Nenhum membro nesta squad</Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.closeFooterButton} onPress={onClose}>
              <Text style={styles.closeFooterButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  squadInfo: {
    padding: 20,
    backgroundColor: '#F5F7FA',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  membersList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  memberIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  memberDetails: {
    fontSize: 12,
    color: '#999',
  },
  roleTag: {
    backgroundColor: '#0A4A8E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  roleBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0A4A8E',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
  modalFooter: {
    padding: 20,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  closeFooterButton: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeFooterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});
