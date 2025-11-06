import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const PROFILE_NOME_KEY = 'profile_nome';

type SquadType = {
  id: string;
  name: string;
  members: number;
};
const initialSquadData: SquadType[] = [
  { id: '1', name: 'Squad LSD', members: 8 },
  { id: '2', name: 'Squad INFRA', members: 5 },
  { id: '3', name: 'Squad CASE', members: 12 },
  { id: '4', name: 'Squad 404', members: 3 },
  { id: '5', name: 'Squad Alpha', members: 7 },
];
type SquadItemProps = {
  item: SquadType;
  onEdit: (item: SquadType) => void;
  onViewMembers: (item: SquadType) => void;
};
const SquadItem = ({ item, onEdit, onViewMembers }: SquadItemProps) => (
  <TouchableOpacity onPress={() => router.push({
      pathname: "/squadDetail" as any, 
      params: { squadId: item.id, squadName: item.name }
    })}
  >
    <View style={styles.listItemContainer}>
      <Text style={styles.squadNameText}>{item.name}</Text>
      <TouchableOpacity style={styles.integrantesContainer} onPress={(e) => { e.stopPropagation(); onViewMembers(item); }}>
        <FontAwesome5 name="user" size={14} color="#1E63B0" />
        <Text style={styles.integrantesText}>{item.members}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.editButton} onPress={(e) => { e.stopPropagation(); onEdit(item); }}>
        <FontAwesome5 name="pencil-alt" size={18} color="#a0a0a0" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

export default function SquadsScreen() {
  const [searchText, setSearchText] = useState('');
  const [filteredSquads, setFilteredSquads] = useState(initialSquadData);
  // 4. Criar estado para o nome do usuário
  const [userName, setUserName] = useState("Marcelo");

  // Lógica de pesquisa (sem mudanças)
  useEffect(() => {
    if (searchText === '') {
      setFilteredSquads(initialSquadData);
    } else {
      const results = initialSquadData.filter(squad =>
        squad.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredSquads(results);
    }
  }, [searchText]);

  // 5. Adicionar useFocusEffect para carregar o nome
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

  const handleAddSquad = () => Alert.alert("Adicionar", "A tela para adicionar um novo squad será aberta aqui.");
  const handleEditSquad = (squad: SquadType) => Alert.alert("Editar", `Editar o ${squad.name}`);
  const handleViewMembers = (squad: SquadType) => Alert.alert("Integrantes", `Visualizar os ${squad.members} integrantes do ${squad.name}`);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            {/* 6. Conectar nome ao estado e clique ao router */}
            <TouchableOpacity style={styles.headerProfile} onPress={() => router.push('/usuarios')}>
              <FontAwesome5 name="user-circle" size={28} color="white" />
              <Text style={styles.headerName}>{userName}</Text>
            </TouchableOpacity>
            <Ionicons name="menu" size={32} color="white" />
          </View>
          <Text style={styles.screenTitle}>Controle de Squads</Text>
        </View>

        <View style={styles.searchSection}>
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
        </View>
        
        <View style={styles.listCard}>
            <FlatList
            contentContainerStyle={{ paddingBottom: 20 }}
            data={filteredSquads}
            ListHeaderComponent={() => (
                <View style={styles.listHeader}>
                <Text style={styles.headerColNome}>Nome</Text>
                <Text style={styles.headerColIntegrantes}>Integrantes</Text>
                <Text style={styles.headerColEditar}>Editar</Text>
                </View>
            )}
            renderItem={({ item }) => (
                <SquadItem 
                item={item} 
                onEdit={handleEditSquad} 
                onViewMembers={handleViewMembers} 
                />
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={() => (
                <View style={styles.addButtonContainer}>
                    <TouchableOpacity style={styles.addButton} onPress={handleAddSquad}>
                        <Text style={styles.addButtonText}>Adicionar squads</Text>
                        <Ionicons name="add" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            )}
            />
        </View>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F2F5', },
  container: { flex: 1, backgroundColor: '#F0F2F5', paddingBottom: 70, },
  header: { backgroundColor: '#0A4A8E', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', },
  headerProfile: { flexDirection: 'row', alignItems: 'center', },
  headerName: { color: 'white', fontSize: 18, marginLeft: 10, fontWeight: 'bold', },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: 20, },
  searchSection: { paddingHorizontal: 20, marginTop: -25, zIndex: 2, },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 50, paddingHorizontal: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, },
  searchIcon: { marginRight: 10, },
  searchInput: { flex: 1, height: 50, fontSize: 16, color: '#333', },
  listCard: { flex: 1, marginHorizontal: 20, marginTop: 20, backgroundColor: 'white', borderRadius: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, },
  listHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', },
  headerColNome: { flex: 1, color: '#a0a0a0', fontWeight: 'bold', },
  headerColIntegrantes: { width: 100, textAlign: 'center', color: '#a0a0a0', fontWeight: 'bold', },
  headerColEditar: { width: 50, textAlign: 'center', color: '#a0a0a0', fontWeight: 'bold', },
  listItemContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 15, },
  squadNameText: { flex: 1, fontSize: 16, color: '#333', fontWeight: 'bold', },
  integrantesContainer: { width: 100, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
  integrantesText: { fontSize: 16, color: '#1E63B0', marginLeft: 8, },
  editButton: { width: 50, alignItems: 'center', justifyContent: 'center', },
  separator: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 15, },
  addButtonContainer: { padding: 20, },
  addButton: { backgroundColor: '#1E63B0', borderRadius: 15, paddingVertical: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5, },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginRight: 10, },
});