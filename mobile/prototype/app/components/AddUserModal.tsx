import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const AddUserModal: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Adicionar Novo Usuário</Text>
          <Button title="Fechar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', elevation: 5 },
  modalText: { marginBottom: 15, textAlign: 'center', fontSize: 18 },
});

export default AddUserModal;