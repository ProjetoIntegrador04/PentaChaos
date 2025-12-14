import React, { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import { router } from 'expo-router'; 
import { useAuth } from '../../context/AuthContext';
import { usePerfilModal } from '../../context/PerfilModalContext';
import { useProfileImage } from '../../context/ProfileImageContext';
import dashboardService from '../../services/dashboard.service';
import reportService from '../../services/report.service';
import userService from '../../services/user.service';
import taskService from '../../services/task.service';
import { Squad } from '../../types/squad.types';
import SquadMembersModal from '../../components/SquadMembersModal';
import DrawerMenu from '../../components/DrawerMenu';
import notificationService from '../../services/notification.service';

const screenWidth = Dimensions.get('window').width;

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
  const { user } = useAuth();
  const { openModal } = usePerfilModal();
  const { profileImage } = useProfileImage();
  const [userName, setUserName] = useState("Usuário");
  const [loading, setLoading] = useState(true);
  const [squads, setSquads] = useState<Squad[]>([]);
  const [frequencyData, setFrequencyData] = useState({
    presencas: 80,
    faltas: 20,
    percentual: 80,
  });
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setUserName(user.username);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    // Inscreve no serviço de notificações
    const unsubscribe = notificationService.subscribe(setUnreadCount);
    return () => unsubscribe();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const { squads: squadData, stats } = await dashboardService.getDashboardData();
      setSquads(squadData);
      
      // Atualiza dados de frequência
      setFrequencyData({
        presencas: stats.presencas,
        faltas: stats.faltas,
        percentual: stats.frequencyRate,
      });
    } catch (error) {
      console.error('❌ Erro ao carregar dashboard:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSquadClick = (squad: Squad) => {
    setSelectedSquad(squad);
    setShowMembersModal(true);
  };

  const handleGeneratePDF = async () => {
    try {
      setGeneratingPDF(true);
      
      const mySquads = squads.map(s => s.name);
      
      // Buscar dados de todos os usuários
      let allUsersData: any[] = [];
      
      try {
        // Buscar todos os usuários
        const allUsers = await userService.getAllUsers();
        
        // Buscar todas as tarefas (admin vê todas)
        const allTasks = await taskService.getAllTasks();
        
        // Buscar dados de frequência para cada usuário
        const usersDataPromises = allUsers.map(async (currentUser) => {
          try {
            // Filtrar tarefas do usuário
            const userTasks = allTasks.filter((task: any) => {
              if (typeof task.responsavel === 'object' && task.responsavel?.id) {
                return task.responsavel.id === currentUser.id;
              } else if (typeof task.responsavel === 'string') {
                return task.responsavel === currentUser.username;
              }
              return false;
            });
            
            const completedTasks = userTasks.filter((task: any) => task.status === 'CONCLUIDA').length;
            const totalTasks = userTasks.length;
            
            // Para frequência, usamos os dados do usuário logado se for ele
            // Para outros usuários, usamos porcentagem de tarefas concluídas como estimativa
            let frequencyPercentage = 0;
            if (currentUser.username === user?.username) {
              frequencyPercentage = frequencyData.percentual;
            } else {
              frequencyPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            }
            
            return {
              name: currentUser.fullName || currentUser.username,
              email: currentUser.email,
              frequencyPercentage,
              completedTasks,
              totalTasks,
            };
          } catch (error) {
            console.error(`Erro ao processar dados do usuário ${currentUser.username}:`, error);
            return {
              name: currentUser.fullName || currentUser.username,
              email: currentUser.email,
              frequencyPercentage: 0,
              completedTasks: 0,
              totalTasks: 0,
            };
          }
        });
        
        allUsersData = await Promise.all(usersDataPromises);
        console.log(`✅ Dados de ${allUsersData.length} usuários coletados para o relatório`);
      } catch (error) {
        console.error('❌ Erro ao buscar dados dos usuários:', error);
        // Continua sem os dados de usuários
      }
      
      await reportService.generateDashboardReport(
        {
          name: userName,
          email: user?.email || 'N/A',
          ra: user?.ra,
        },
        {
          frequencyData: {
            presencas: frequencyData.presencas,
            faltas: frequencyData.faltas,
            percentual: frequencyData.percentual,
          },
          squadsData: {
            totalSquads: squads.length,
            mySquads,
          },
          allUsersData: allUsersData.length > 0 ? allUsersData : undefined,
        }
      );

      Alert.alert('Sucesso', 'Relatório gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao gerar PDF:', error);
      // Erro já tratado no serviço
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Prepara dados para o gráfico de pizza
  const attendanceDataPie = [
    { 
      name: 'Presenças', 
      population: frequencyData.presencas, 
      color: '#10b981', // Verde 
      legendFontColor: '#333', 
      legendFontSize: 14 
    },
    { 
      name: 'Faltas', 
      population: frequencyData.faltas || 1, // Evita divisão por zero
      color: '#ef4444', // Vermelho
      legendFontColor: '#333', 
      legendFontSize: 14 
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* --- CABEÇALHO ATUALIZADO --- */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            {/* Link para o Perfil */}
            <TouchableOpacity style={styles.headerProfile} onPress={openModal}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileAvatar} />
              ) : (
                <FontAwesome5 name="user-circle" size={28} color="white" />
              )}
              <Text style={styles.headerName}>{userName}</Text> 
            </TouchableOpacity>
            
            {/* Ícones da Direita: Notificações e Menu */}
            <View style={styles.headerIconsContainer}>
              <TouchableOpacity 
                onPress={() => router.push({ pathname: '/notificacoes' as any })}
                style={{ position: 'relative' }}
              >
                <Ionicons name="notifications-outline" size={28} color="white" />
                {unreadCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDrawerVisible(true)}>
                <Ionicons name="menu" size={32} color="white" style={{ marginLeft: 15 }} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.sectionTitle}>Dashboard</Text>
        </View>
        {/* --- FIM DO CABEÇALHO --- */}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0A4A8E" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : (
          <>
            {/* Seção Dashboard Cards - SQUADS REAIS */}
            <View style={styles.dashboardSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.squadCardsContainer}>
                {squads.length > 0 ? (
                  <>
                    {squads.map((squad) => (
                      <TouchableOpacity 
                        key={squad.id} 
                        style={styles.squadCard}
                        onPress={() => handleSquadClick(squad)}
                      >
                        <Text style={styles.squadName}>{squad.name}</Text>
                        <View style={styles.internsContainer}>
                          <FontAwesome5 name="user" size={12} color="#ccc" />
                          <Text style={styles.squadInterns}> {squad.memberCount} {squad.memberCount === 1 ? 'membro' : 'membros'}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity 
                      style={styles.arrowCard}
                      onPress={() => router.push('/(tabs)/squads')}
                    >
                      <Ionicons name="arrow-forward" size={24} color="white" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={styles.emptySquadsCard}>
                    <Ionicons name="people-outline" size={32} color="#ccc" />
                    <Text style={styles.emptySquadsText}>Nenhuma squad cadastrada</Text>
                  </View>
                )}
              </ScrollView>
            </View>

            {/* Card de Frequência - DADOS REAIS */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Minha Frequência (30 dias)</Text>
              <View style={styles.frequencyContent}>
                <PieChart
                  data={attendanceDataPie} 
                  width={screenWidth * 0.4} 
                  height={140} 
                  chartConfig={chartConfig}
                  accessor={"population"} 
                  backgroundColor={"transparent"} 
                  paddingLeft={"10"} 
                  center={[5, 0]} 
                  hasLegend={false}
                />
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
                    <Text style={styles.legendText}>Dias presentes</Text>
                    <Text style={styles.legendValue}>{frequencyData.presencas}</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
                    <Text style={styles.legendText}>Dias ausentes</Text>
                    <Text style={styles.legendValue}>{frequencyData.faltas}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.legendItem}>
                    <FontAwesome5 name="percentage" size={14} color="#0A4A8E" />
                    <Text style={styles.legendTextBold}>Taxa de presença</Text>
                    <Text style={styles.legendValueBold}>{frequencyData.percentual}%</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.cardSubtitle}>
                {frequencyData.percentual >= 90 && '🎉 Excelente! Continue assim!'}
                {frequencyData.percentual >= 75 && frequencyData.percentual < 90 && '✅ Bom trabalho!'}
                {frequencyData.percentual >= 50 && frequencyData.percentual < 75 && '⚠️ Atenção à sua frequência'}
                {frequencyData.percentual < 50 && '❌ Frequência baixa. Procure melhorar!'}
              </Text>
            </View>

            {/* Cards de Estatísticas Rápidas */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: '#0A4A8E' }]}>
                  <Ionicons name="people" size={24} color="white" />
                </View>
                <Text style={styles.statValue}>{squads.length}</Text>
                <Text style={styles.statLabel}>Minhas Squads</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: '#10b981' }]}>
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                </View>
                <Text style={styles.statValue}>{frequencyData.presencas}</Text>
                <Text style={styles.statLabel}>Presenças</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: '#ef4444' }]}>
                  <Ionicons name="close-circle" size={24} color="white" />
                </View>
                <Text style={styles.statValue}>{frequencyData.faltas}</Text>
                <Text style={styles.statLabel}>Ausências</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal de Membros da Squad */}
      <SquadMembersModal
        visible={showMembersModal}
        squad={selectedSquad}
        onClose={() => setShowMembersModal(false)}
      />

      {/* Drawer Menu */}
      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />

      {/* Botão Flutuante de Exportar PDF */}
      {!loading && (
        <TouchableOpacity 
          style={styles.fabButton}
          onPress={handleGeneratePDF}
          disabled={generatingPDF}
        >
          {generatingPDF ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="document-text" size={28} color="white" />
          )}
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0A4A8E', },
  container: { flex: 1, backgroundColor: '#F0F2F5', },
  // Estilo do Cabeçalho Atualizado
  header: { 
    backgroundColor: '#0A4A8E', 
    paddingHorizontal: 20, 
    paddingTop: 40, 
    paddingBottom: 20, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
  },
  headerTopRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '100%', 
  },
  headerProfile: { 
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  profileAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'white',
  },
  headerName: { 
    color: 'white', 
    fontSize: 18, 
    marginLeft: 10, 
    fontWeight: 'bold', 
  },
  // Novos estilos para os ícones da direita
  headerIconsContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationDot: { 
    position: 'absolute', 
    top: 0, 
    right: 15, // Posição do ponto vermelho
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: 'red', 
    borderWidth: 1, 
    borderColor: 'white',
  },
  // Resto dos estilos
  dashboardSection: { 
    paddingHorizontal: 20, 
    marginTop: 20, 
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: 'white', // Corrigido para branco
    marginTop: 20, 
    marginBottom: 5, 
  },
  squadCardsContainer: { paddingVertical: 10, },
  squadCard: { backgroundColor: '#1E63B0', borderRadius: 20, padding: 20, marginRight: 15, width: 140, height: 100, justifyContent: 'space-between', shadowColor: "#1E63B0", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 8, },
  arrowCard: { backgroundColor: '#1E63B0', borderRadius: 20, marginRight: 15, width: 60, height: 100, justifyContent: 'center', alignItems: 'center', elevation: 8, },
  squadName: { color: 'white', fontSize: 16, fontWeight: 'bold', },
  internsContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, },
  squadInterns: { color: '#ccc', fontSize: 12, },
  emptySquadsCard: { 
    backgroundColor: '#E0E0E0', 
    borderRadius: 20, 
    padding: 20, 
    width: 200, 
    height: 100, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  emptySquadsText: { 
    color: '#999', 
    fontSize: 14, 
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  card: { backgroundColor: 'white', borderRadius: 20, paddingVertical: 20, marginHorizontal: 20, marginTop: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15, width: '100%', paddingHorizontal: 20, },
  cardSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 15, paddingHorizontal: 20, fontStyle: 'italic', },
  frequencyContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: 10, },
  legendContainer: { marginLeft: 20, flex: 1, },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, },
  legendColor: { width: 15, height: 15, borderRadius: 4, marginRight: 8, },
  legendText: { flex: 1, fontSize: 13, color: '#666', },
  legendValue: { fontSize: 14, fontWeight: '600', color: '#333', minWidth: 30, textAlign: 'right', },
  legendTextBold: { flex: 1, fontSize: 13, fontWeight: 'bold', color: '#333', marginLeft: 8, },
  legendValueBold: { fontSize: 16, fontWeight: 'bold', color: '#0A4A8E', minWidth: 40, textAlign: 'right', },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 8, },
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    marginTop: 20, 
    marginBottom: 20,
  },
  statCard: { 
    backgroundColor: 'white', 
    borderRadius: 15, 
    padding: 15, 
    alignItems: 'center', 
    flex: 1, 
    marginHorizontal: 5,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 5,
  },
  statLabel: { 
    fontSize: 12, 
    color: '#666', 
    textAlign: 'center',
  },
  monthSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingHorizontal: 30, width: '100%', },
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0A4A8E',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});