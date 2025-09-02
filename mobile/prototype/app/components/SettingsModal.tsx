import React from 'react';
import { Modal, View, Text, Button, StyleSheet, Switch } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SettingsModal: React.FC<Props> = ({ visible, onClose }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Configurações  </Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Habilitar Notificações</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Modo Escuro</Text>
            <Switch value={false} />
          </View>
          <Button title="Fechar" onPress={onClose} color="#007BFF" />
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
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 16,
  },
});

export default SettingsModal;