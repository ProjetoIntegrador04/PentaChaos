import React from 'react';
import { Modal, View, Text, Button, StyleSheet, TextInput } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const AddSquadModal: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Criar Nova Squad</Text>
          <TextInput
            placeholder="Nome da Squad"
            style={styles.input}
          />
          <TextInput
            placeholder="Descrição"
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <Button title="Cancelar" onPress={onClose} color="red" />
            <Button title="Salvar" onPress={onClose} />
          </View>
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
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
    width: '80%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
});

export default AddSquadModal;