// 1. Importar useState e useEffect
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import MapDisplay from '@/components/map/MapDisplay'; // Importa o componente de mapa

export default function PontoScreen() {
  // 2. Criar estado para a hora atual
  const [currentTime, setCurrentTime] = useState(new Date());

  // 3. useEffect para atualizar a hora a cada segundo
  useEffect(() => {
    // Inicia um intervalo que roda a cada 1000ms (1 segundo)
    const timerId = setInterval(() => {
      setCurrentTime(new Date()); // Atualiza o estado com a nova hora
    }, 1000);

    // Função de limpeza: será executada quando o componente for desmontado
    return () => {
      clearInterval(timerId); // Para o intervalo para evitar vazamento de memória
    };
  }, []); // O array vazio [] faz com que o useEffect rode apenas uma vez (ao montar)

  // 4. Função para formatar a data e hora
  const formatDateTime = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  };

  const handleIncluirPonto = () => {
    alert("Lógica para incluir o ponto será implementada aqui.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
           <View style={styles.headerTopRow}>
             <View style={styles.headerProfile}>
               <FontAwesome5 name="user-circle" size={28} color="white" />
               <Text style={styles.headerName}>Marcelo</Text>
             </View>
             <Ionicons name="menu" size={32} color="white" />
           </View>
           <Text style={styles.screenTitle}>Ponto</Text>
         </View>

        {/* Mapa Container */}
        <View style={styles.mapContainer}>
          <MapDisplay />
        </View>

        {/* Informações Abaixo do Mapa */}
        <View style={styles.infoContainer}>
          {/* 5. Exibe a hora formatada e atualizada */}
          <Text style={styles.dateTimeText}>{formatDateTime(currentTime)}</Text>
          <Text style={styles.distanceText}>5957.23 metros</Text>
          <Text style={styles.locationText}>Sorocaba, São Paulo, Brasil</Text>
        </View>

        {/* Botão Incluir Ponto */}
        <TouchableOpacity style={styles.actionButton} onPress={handleIncluirPonto}>
          <Text style={styles.actionButtonText}>Incluir Ponto</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Estilos (sem alterações)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F2F5', },
  container: { flex: 1, backgroundColor: '#F0F2F5', },
  header: { backgroundColor: '#0A4A8E', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', },
  headerProfile: { flexDirection: 'row', alignItems: 'center', },
  headerName: { color: 'white', fontSize: 18, marginLeft: 10, fontWeight: 'bold', },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: 20, },
  mapContainer: {
    height: Dimensions.get('window').height * 0.4,
    marginTop: -20, marginHorizontal: 10, borderRadius: 15,
    overflow: 'hidden', zIndex: 1, elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  infoContainer: { alignItems: 'center', paddingVertical: 20, marginTop: 10, },
  dateTimeText: { fontSize: 18, fontWeight: 'bold', color: '#333', },
  distanceText: { fontSize: 16, color: 'red', marginTop: 5, },
  locationText: { fontSize: 14, color: 'gray', marginTop: 5, },
  actionButton: { backgroundColor: '#38BDF8', borderRadius: 10, paddingVertical: 15, marginHorizontal: 20, alignItems: 'center', marginTop: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5, },
  actionButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', },
});