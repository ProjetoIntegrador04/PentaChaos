import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, FontAwesome5, Foundation } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const PROFILE_NOME_KEY = 'profile_nome';

type RankingItemType = {
  id: string;
  position: number;
  name: string;
  frequency: string;
  points: number;
};

// --- AQUI ESTÁ A LISTA ATUALIZADA COM 10 NOMES ---
const rankingData: RankingItemType[] = [
  { id: '1', position: 1, name: 'David Francisco', frequency: '94,3%', points: 15 },
  { id: '2', position: 2, name: 'Ana Clara', frequency: '92,1%', points: 12 },
  { id: '3', position: 3, name: 'Lucas Souza', frequency: '90,5%', points: 10 },
  { id: '4', position: 4, name: 'Mariana Costa', frequency: '88,9%', points: 8 },
  { id: '5', position: 5, name: 'Pedro Henrique', frequency: '87,0%', points: 8 },
  { id: '6', position: 6, name: 'Juliana Silva', frequency: '85,2%', points: 7 },
  { id: '7', position: 7, name: 'Gabriel Alves', frequency: '84,0%', points: 5 },
  { id: '8', position: 8, name: 'Beatriz Lima', frequency: '82,1%', points: 3 },
  { id: '9', position: 9, name: 'Matheus Pereira', frequency: '80,0%', points: 2 },
  { id: '10', position: 10, name: 'Laura Mendes', frequency: '78,5%', points: 0 },
];

const RankingItem = ({ item }: { item: RankingItemType }) => (
  <View style={styles.listItemContainer}>
    <Text style={styles.positionText}>{item.position}</Text>
    <Text style={styles.nameText} numberOfLines={1}>{item.name}</Text>
    <Text style={styles.frequencyText}>{item.frequency}</Text>
    <View style={styles.pointsContainer}>
      <View style={styles.pointsBadge}>
        <Text style={styles.pointsText}>{item.points}</Text>
      </View>
    </View>
  </View>
);

export default function RankingScreen() {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(rankingData);
  const [userName, setUserName] = useState("Marcelo");

  useEffect(() => {
    if (searchText === '') {
      setFilteredData(rankingData);
    } else {
      const results = rankingData.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(results);
    }
  }, [searchText]);

  useFocusEffect(
    React.useCallback(() => {
      const loadUserName = async () => {
        try {
          const savedName = await AsyncStorage.getItem(PROFILE_NOME_KEY);
          if (savedName !== null) {
            setUserName(savedName); // Atualiza o nome na tela
          }
        } catch (e) {
          console.error("Falha ao carregar o nome do usuário", e);
        }
      };
      loadUserName();
    }, [])
  );

  const handleAddItem = () => {
    Alert.alert("Adicionar Item", "A lógica para adicionar um novo item no ranking será implementada aqui.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.headerProfile} onPress={() => router.push({ pathname: '/perfil' as any })}>
              <FontAwesome5 name="user-circle" size={28} color="white" />
              <Text style={styles.headerName}>{userName}</Text>
            </TouchableOpacity>
            <Ionicons name="menu" size={32} color="white" />
          </View>
          <Text style={styles.sectionTitle}>Ranking</Text>
        </View>

        {/* Barra de Pesquisa */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquise por nome..."
              placeholderTextColor="#ccc"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>
        
        {/* Card da Lista */}
        <View style={styles.listCard}>
          <View style={styles.listHeader}>
            <Text style={styles.headerPosText}>#</Text>
            <Text style={styles.headerNameText}>Nome</Text>
            <Text style={styles.headerFreqText}>Frequência</Text>
            <Text style={styles.headerPtsText}>Pts.</Text>
          </View>
          <FlatList
            data={filteredData}
            renderItem={({ item }) => <RankingItem item={item} />}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </View>

      {/* Botão Adicionar */}
      <TouchableOpacity style={styles.fab} onPress={handleAddItem}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F2F5', },
  container: { flex: 1, backgroundColor: '#F0F2F5', },
  header: { backgroundColor: '#0A4A8E', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', },
  headerProfile: { flexDirection: 'row', alignItems: 'center', },
  headerName: { color: 'white', fontSize: 18, marginLeft: 10, fontWeight: 'bold', },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginTop: 20, marginBottom: 5, },
  searchSection: { paddingHorizontal: 20, marginTop: 20, },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 50, paddingHorizontal: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5, },
  searchIcon: { marginRight: 10, },
  searchInput: { flex: 1, height: 50, fontSize: 16, color: '#333', },
  listCard: { backgroundColor: 'white', marginHorizontal: 20, marginTop: 20, borderRadius: 15, paddingBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5, flex: 1, },
  listHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', },
  headerPosText: { width: 30, color: '#a0a0a0', fontSize: 14, fontWeight: 'bold', },
  headerNameText: { flex: 1, color: '#a0a0a0', fontSize: 14, fontWeight: 'bold', },
  headerFreqText: { width: 100, color: '#a0a0a0', fontSize: 14, fontWeight: 'bold', textAlign: 'center', },
  headerPtsText: { width: 60, color: '#a0a0a0', fontSize: 14, fontWeight: 'bold', textAlign: 'center', },
  listItemContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10, },
  separator: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 10, },
  positionText: { width: 30, fontSize: 16, fontWeight: 'bold', color: '#333', },
  nameText: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#333', },
  frequencyText: { width: 100, fontSize: 16, color: '#1E63B0', textAlign: 'center', },
  pointsContainer: { width: 60, alignItems: 'center', },
  pointsBadge: { backgroundColor: '#1E63B0', borderRadius: 15, paddingHorizontal: 15, paddingVertical: 5, minWidth: 40, alignItems: 'center', },
  pointsText: { color: 'white', fontWeight: 'bold', },
  fab: { position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 80, backgroundColor: '#0A4A8E', borderRadius: 30, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, },
});