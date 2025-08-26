import React from 'react';
import { Modal, View, Text, Button, StyleSheet, Image } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const ProfileModal: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Perfil do Usuário</Text>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150' }} // Imagem de placeholder
            style={styles.avatar}
          />
          <Text style={styles.userName}>Usuário Exemplo</Text>
          <Text style={styles.userEmail}>usuario@exemplo.com</Text>
          <Button title="Fechar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '500',
  },
  userEmail: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
});

export default ProfileModal;