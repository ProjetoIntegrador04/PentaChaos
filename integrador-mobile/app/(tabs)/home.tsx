import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const squadData = [
  { name: 'LSD Squad', interns: 5 },
  { name: '404 Squad', interns: 2 },
  { name: 'Alpha Squad', interns: 8 },
  { name: 'Infra Squad', interns: 4 },
  { name: 'Pernambuncanas Squad', interns: 10 },
];

const attendanceDataPie = [
  { name: 'Presenças', population: 80, color: '#0A4A8E', legendFontColor: '#333', legendFontSize: 14 },
  { name: 'Faltas', population: 20, color: '#ff8c00', legendFontColor: '#333', legendFontSize: 14 },
];

const deliveriesDataLine = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
  datasets: [ { data: [20, 45, 28, 80, 99], color: (opacity = 1) => `rgba(255, 140, 0, ${opacity})`, strokeWidth: 2, }, ],
};

const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForDots: { r: "6", strokeWidth: "2", stroke: "#ff8c00" }
};

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerProfile}>
              <FontAwesome5 name="user-circle" size={28} color="white" />
              <Text style={styles.headerName}>Marcelo</Text>
            </View>
            <Ionicons name="menu" size={32} color="white" />
          </View>
          <Text style={styles.sectionTitle}>Dashboard</Text>
        </View>

        <View style={styles.dashboardSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.squadCardsContainer}>
            {squadData.map((squad, index) => (
              <View key={index} style={styles.squadCard}>
                <Text style={styles.squadName}>{squad.name}</Text>
                <View style={styles.internsContainer}>
                    <FontAwesome5 name="user" size={12} color="#ccc" />
                    <Text style={styles.squadInterns}> Estagiários: {squad.interns}</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.arrowCard}>
                <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Frequência</Text>
          <View style={styles.frequencyContent}>
            <PieChart
              data={attendanceDataPie} width={screenWidth * 0.4} height={140} chartConfig={chartConfig}
              accessor={"population"} backgroundColor={"transparent"} paddingLeft={"10"} center={[5, 0]} hasLegend={false}
            />
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#0A4A8E' }]} />
                <Text>Presenças</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#ff8c00' }]} />
                <Text>Faltas</Text>
              </View>
            </View>
          </View>
          <View style={styles.monthSelector}>
              <Ionicons name="chevron-back" size={24} color="gray" />
              <Text>Ago - Set</Text>
              <Ionicons name="chevron-forward" size={24} color="gray" />
          </View>
        </View>
        
        <TouchableOpacity style={styles.integrantesButton}>
            <Text style={styles.integrantesText}>Integrantes</Text>
            <Ionicons name="chevron-down" size={20} color="white" />
        </TouchableOpacity>

        <View style={styles.card}>
             <Text style={[styles.cardTitle, {textAlign: 'right', paddingRight: 20}]}>Entregas</Text>
             <LineChart
                data={deliveriesDataLine} width={screenWidth - 40} height={200}
                chartConfig={chartConfig} bezier style={{ borderRadius: 16 }}
             />
        </View>
        
        <View style={styles.footerButtons}>
            <View style={styles.timeFilter}>
                <TouchableOpacity style={styles.timeButton}><Text style={styles.timeButtonText}>1M</Text></TouchableOpacity>
                <TouchableOpacity style={styles.timeButton}><Text style={styles.timeButtonText}>3M</Text></TouchableOpacity>
                <TouchableOpacity style={styles.timeButton}><Text style={styles.timeButtonText}>6M</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.reportButton}>
                <Text style={styles.reportButtonText}>Relatório</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A4A8E', },
  container: { flex: 1, backgroundColor: '#F0F2F5', },
  header: { backgroundColor: '#0A4A8E', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', },
  headerProfile: { flexDirection: 'row', alignItems: 'center', },
  headerName: { color: 'white', fontSize: 18, marginLeft: 10, fontWeight: 'bold', },
  dashboardSection: { paddingHorizontal: 20, marginTop: 20, },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginTop: 20, marginBottom: 5, },
  squadCardsContainer: { paddingVertical: 10, },
  squadCard: { backgroundColor: '#1E63B0', borderRadius: 20, padding: 20, marginRight: 15, width: 140, height: 100, justifyContent: 'space-between', shadowColor: "#1E63B0", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 8, },
  arrowCard: { backgroundColor: '#1E63B0', borderRadius: 20, marginRight: 15, width: 60, height: 100, justifyContent: 'center', alignItems: 'center', elevation: 8, },
  squadName: { color: 'white', fontSize: 16, fontWeight: 'bold', },
  internsContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, },
  squadInterns: { color: '#ccc', fontSize: 12, },
  card: { backgroundColor: 'white', borderRadius: 20, paddingVertical: 20, marginHorizontal: 20, marginTop: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, width: '100%', paddingHorizontal: 20, },
  frequencyContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: 10, },
  legendContainer: { marginLeft: 20, },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, },
  legendColor: { width: 15, height: 15, borderRadius: 4, marginRight: 10, },
  monthSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingHorizontal: 30, width: '100%', },
  integrantesButton: { backgroundColor: '#1E63B0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 80, marginTop: 30, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8, },
  integrantesText: { color: 'white', fontSize: 16, fontWeight: 'bold', },
  footerButtons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 20, },
  timeFilter: { flexDirection: 'row', },
  timeButton: { backgroundColor: 'white', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 15, marginRight: 10, borderWidth: 1, borderColor: '#ddd', },
  timeButtonText: { color: '#1E63B0', fontWeight: 'bold', },
  reportButton: { backgroundColor: '#1E63B0', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 25, },
  reportButtonText: { color: 'white', fontWeight: 'bold', }
});