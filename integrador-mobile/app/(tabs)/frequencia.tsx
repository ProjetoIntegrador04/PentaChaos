import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, FontAwesome5, Foundation } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_NOME_KEY = 'profile_nome';

type FrequenciaItem = {
  id: string;
  name: string;
  status: 'ATIVO' | 'INATIVO';
  ponto1: string;
  ponto2: string;
  ponto3: string;
  ponto4: string;
};

const frequencyData: FrequenciaItem[] = [
  { id: '1', name: 'David Francisco', status: 'ATIVO', ponto1: '9h00', ponto2: '12h00', ponto3: '13h00', ponto4: '16h00' },
  { id: '2', name: 'Ana Clara', status: 'ATIVO', ponto1: '9h05', ponto2: '12h10', ponto3: '13h00', ponto4: '16h05' },
  { id: '3', name: 'Lucas Souza', status: 'ATIVO', ponto1: '8h55', ponto2: '11h50', ponto3: '13h01', ponto4: '16h02' },
  { id: '4', name: 'Mariana Costa', status: 'ATIVO', ponto1: '9h02', ponto2: '12h00', ponto3: '13h01', ponto4: '16h03' },
  { id: '5', name: 'Pedro Henrique', status: 'ATIVO', ponto1: '9h02', ponto2: '12h05', ponto3: '13h01', ponto4: '16h03' },
  { id: '6', name: 'Juliana Silva', status: 'ATIVO', ponto1: '8h58', ponto2: '11h55', ponto3: '13h02', ponto4: '16h05' },
  { id: '7', name: 'Gabriel Alves', status: 'ATIVO', ponto1: '9h01', ponto2: '12h00', ponto3: '13h00', ponto4: '16h01' },
  { id: '8', name: 'Beatriz Lima', status: 'ATIVO', ponto1: '9h00', ponto2: '12h00', ponto3: '13h00', ponto4: '16h00' },
  { id: '9', name: 'Matheus Pereira', status: 'ATIVO', ponto1: '9h03', ponto2: '12h05', ponto3: '13h00', ponto4: '16h03' },
  { id: '10', name: 'Laura Mendes', status: 'ATIVO', ponto1: '9h02', ponto2: '12h05', ponto3: '13h01', ponto4: '16h03' },
];

const FrequenciaItemRow = ({ item }: { item: FrequenciaItem }) => (
  <View style={styles.listItemContainer}>
    <Text style={[styles.cellText, styles.statusCell, item.status === 'ATIVO' ? styles.statusActive : styles.statusInactive]}>
      {item.status}
    </Text>
    <Text style={[styles.cellText, styles.nameCell]}>{item.name}</Text>
    <Text style={[styles.cellText, styles.pontoCell]}>{item.ponto1}</Text>
    <Text style={[styles.cellText, styles.pontoCell]}>{item.ponto2}</Text>
    <Text style={[styles.cellText, styles.pontoCell]}>{item.ponto3}</Text>
    <Text style={[styles.cellText, styles.pontoCell]}>{item.ponto4}</Text>
    <View style={styles.actionCell}>
      <TouchableOpacity onPress={() => Alert.alert('Ação', `Validar ${item.name}`)}>
        <Ionicons name="checkmark-circle-outline" size={24} color="green" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Alert.alert('Ação', `Editar ${item.name}`)} style={{ marginLeft: 10 }}>
        <FontAwesome5 name="pencil-alt" size={18} color="#1E63B0" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function FrequenciaScreen() {
  const [userName, setUserName] = useState("Marcelo");
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(frequencyData);
  const [currentDate, setCurrentDate] = useState(new Date()); 

  const formatDisplayDate = (date: Date) => {
    const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    const dayName = days[date.getDay()];
    const dateString = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${dateString} - ${dayName}`;
  };

  const handleChangeDay = (daysToAdd: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + daysToAdd);
      const dayOfWeek = newDate.getDay();
      if (daysToAdd > 0) {
        if (dayOfWeek === 6) newDate.setDate(newDate.getDate() + 2);
        else if (dayOfWeek === 0) newDate.setDate(newDate.getDate() + 1);
      } else if (daysToAdd < 0) {
        if (dayOfWeek === 0) newDate.setDate(newDate.getDate() - 2);
        else if (dayOfWeek === 6) newDate.setDate(newDate.getDate() - 1);
      }
      Alert.alert("Mudou a data", `Buscando registros para ${formatDisplayDate(newDate)}`);
      return newDate;
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadUserName = async () => {
        try {
          const savedName = await AsyncStorage.getItem(PROFILE_NOME_KEY);
          if (savedName !== null) { setUserName(savedName); }
        } catch (e) { console.error("Falha ao carregar o nome", e); }
      };
      loadUserName();
    }, [])
  );

  useEffect(() => {
    if (searchText === '') {
      setFilteredData(frequencyData);
    } else {
      setFilteredData(
        frequencyData.filter(item =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* --- CABEÇALHO ATUALIZADO --- */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.headerProfile} onPress={() => router.push({ pathname: '/perfil' as any })}>
              <FontAwesome5 name="user-circle" size={28} color="white" />
              <Text style={styles.headerName}>{userName}</Text>
            </TouchableOpacity>
            
            <View style={styles.headerIconsContainer}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/notificacoes' as any })}>
                <Ionicons name="notifications-outline" size={28} color="white" />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {/* Lógica do Menu */}}>
                <Ionicons name="menu" size={32} color="white" style={{ marginLeft: 15 }} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.screenTitle}>Frequência</Text>
        </View>
        {/* --- FIM DO CABEÇALHO --- */}

        <View style={styles.listCard}>
          <View style={styles.cardHeader}>
            <View style={styles.dateButton}>
              <TouchableOpacity onPress={() => handleChangeDay(-1)}>
                <Ionicons name="chevron-back" size={18} color="white" />
              </TouchableOpacity>
              <Text style={styles.dateText}>{formatDisplayDate(currentDate)}</Text>
              <TouchableOpacity onPress={() => handleChangeDay(1)}>
                <Ionicons name="chevron-forward" size={18} color="white" />
              </TouchableOpacity>
            </View>
            {/* O ícone de sino foi movido para o cabeçalho principal */}
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquise..."
              placeholderTextColor="#ccc"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <View style={styles.listHeader}>
            <Text style={[styles.headerText, styles.statusCell]}>Status</Text>
            <Text style={[styles.headerText, styles.nameCell]}>Nome</Text>
            <Text style={[styles.headerText, styles.pontoCell]}>Ponto 1</Text>
            <Text style={[styles.headerText, styles.pontoCell]}>Ponto 2</Text>
            <Text style={[styles.headerText, styles.pontoCell]}>Ponto 3</Text>
            <Text style={[styles.headerText, styles.pontoCell]}>Ponto 4</Text>
            <Text style={[styles.headerText, styles.actionCell]}>Ações</Text>
          </View>

          <FlatList
            data={filteredData}
            renderItem={({ item }) => <FrequenciaItemRow item={item} />}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F2F5' },
  container: { flex: 1, backgroundColor: '#F0F2F5', paddingBottom: 70, },
  header: { backgroundColor: '#0A4A8E', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', },
  headerProfile: { flexDirection: 'row', alignItems: 'center', },
  headerName: { color: 'white', fontSize: 18, marginLeft: 10, fontWeight: 'bold', },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: 20, },
  
  // --- NOVOS ESTILOS PARA O CABEÇALHO ---
  headerIconsContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  notificationDot: { 
    position: 'absolute', 
    top: 0, 
    right: 15, 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: 'red', 
    borderWidth: 1, 
    borderColor: 'white',
  },
  // --- FIM DOS NOVOS ESTILOS ---

  listCard: { flex: 1, marginHorizontal: 15, marginTop: -25, zIndex: 2, backgroundColor: 'white', borderRadius: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, overflow: 'hidden', },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, },
  dateButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E63B0', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, },
  dateText: { color: 'white', fontWeight: 'bold', fontSize: 14, marginHorizontal: 10, },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 10, paddingHorizontal: 15, marginHorizontal: 15, marginBottom: 10, },
  searchIcon: { marginRight: 10, },
  searchInput: { flex: 1, height: 40, fontSize: 16, color: '#333', },
  listHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fafafa', },
  headerText: { color: '#a0a0a0', fontWeight: 'bold', fontSize: 12, },
  listItemContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15, },
  cellText: { fontSize: 12, color: '#333', },
  statusCell: { width: '12%', fontWeight: 'bold', },
  statusActive: { color: 'green', },
  statusInactive: { color: 'gray', },
  nameCell: { width: '20%', fontWeight: '500', },
  pontoCell: { width: '12%', textAlign: 'center', },
  actionCell: { width: '20%', flexDirection: 'row', justifyContent: 'center', },
  separator: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 10, },
});