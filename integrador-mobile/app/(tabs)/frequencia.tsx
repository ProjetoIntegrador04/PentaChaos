import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  ActivityIndicator, 
  Image, 
  RefreshControl, 
  Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { usePerfilModal } from '../../context/PerfilModalContext';
import { useProfileImage } from '../../context/ProfileImageContext';
import clockEntryService from '../../services/clockentry.service';
import type { ClockEntryResponse, ClockEntryType } from '../../types/clockentry.types';

export default function FrequenciaScreen() {
  const { user } = useAuth();
  const { openModal } = usePerfilModal();
  const { profileImage } = useProfileImage();
  
  const [userName, setUserName] = useState("Usuário");
  const [isAdmin, setIsAdmin] = useState(false);
  const [pontosHoje, setPontosHoje] = useState<ClockEntryResponse[]>([]);
  const [todosOsPontos, setTodosOsPontos] = useState<ClockEntryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [registrandoPonto, setRegistrandoPonto] = useState(false);
  const [mostrarLocalizacao, setMostrarLocalizacao] = useState<{ [key: number]: boolean }>({});
  const [modalConfirmacao, setModalConfirmacao] = useState(false);
  const [pontoParaRegistrar, setPontoParaRegistrar] = useState<{ tipo: ClockEntryType; label: string } | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  // Detecta se é admin
  useEffect(() => {
    if (user?.username) {
      setUserName(user.username);
    }
    if (user?.roles) {
      const hasAdminRole = user.roles.some(role => role.name === 'ROLE_ADMIN');
      setIsAdmin(hasAdminRole);
      console.log('👤 Usuário é admin?', hasAdminRole);
    }
  }, [user]);

  // Carrega pontos quando o componente monta
  useEffect(() => {
    if (user) {
      carregarPontosHoje();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, user]);

  const carregarPontosHoje = async () => {
    try {
      setLoading(true);
      console.log('📋 Carregando histórico de pontos...');
      console.log('📋 Usuário:', user?.username, '| Admin:', isAdmin);
      
      // Sempre buscar histórico (simplificado)
      const historico = await clockEntryService.buscarHistorico();
      console.log('📋 Histórico recebido:', historico.length, 'registros');
      console.log('📋 Primeira entrada:', historico[0]);
      
      if (isAdmin) {
        setTodosOsPontos(historico);
        console.log('📋 Total de pontos (admin):', historico.length);
      } else {
        setPontosHoje(historico);
        console.log('📋 Pontos hoje:', historico.length);
      }
    } catch (error: any) {
      console.error('❌ Erro ao carregar pontos:', error);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Detalhes do erro:', error.response?.data);
      console.error('❌ Headers:', error.config?.headers);
      
      const mensagem = error.response?.status === 401 
        ? 'Sua sessão expirou. Faça login novamente.' 
        : 'Não foi possível carregar os pontos.';
      
      Alert.alert('Erro', mensagem);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarPontosHoje();
  };

  const toggleLocalizacao = (id: number) => {
    setMostrarLocalizacao(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const registrarPonto = async (tipo: ClockEntryType) => {
    console.log('🔵 Botão clicado - Tipo:', tipo);
    
    try {
      setRegistrandoPonto(true);
      
      // Verificar permissão de localização
      console.log('🔵 Verificando permissão de localização...');
      const hasPermission = await clockEntryService.verificarPermissaoLocalizacao();
      console.log('🔵 Tem permissão?', hasPermission);
      
      if (!hasPermission) {
        console.log('🔵 Solicitando permissão...');
        const granted = await clockEntryService.solicitarPermissaoLocalizacao();
        console.log('🔵 Permissão concedida?', granted);
        
        if (!granted) {
          console.log('❌ Permissão negada');
          Alert.alert(
            'Permissão Necessária',
            'A localização é necessária para registrar o ponto. Ative nas configurações do dispositivo.'
          );
          setRegistrandoPonto(false);
          return;
        }
      }

      const tipoPontoLabel = clockEntryService.formatarTipoPonto(tipo);
      console.log('🔵 Label do tipo:', tipoPontoLabel);
      
      // Mostrar modal de confirmação
      setPontoParaRegistrar({ tipo, label: tipoPontoLabel });
      setModalConfirmacao(true);
      setRegistrandoPonto(false);
    } catch (error: any) {
      console.error('❌ Erro no registrarPonto:', error);
      Alert.alert('Erro', error.message || 'Ocorreu um erro ao tentar registrar o ponto');
      setRegistrandoPonto(false);
    }
  };

  const confirmarRegistroPonto = async () => {
    if (!pontoParaRegistrar) return;
    
    setModalConfirmacao(false);
    console.log('');
    console.log('════════════════════════════════════════');
    console.log('🔵 INICIANDO REGISTRO DE PONTO');
    console.log('   Tipo:', pontoParaRegistrar.tipo);
    console.log('   Label:', pontoParaRegistrar.label);
    console.log('   Usuário:', user?.username);
    console.log('════════════════════════════════════════');
    console.log('');
    
    try {
      setRegistrandoPonto(true);
      
      // Registrar ponto
      const resultado = await clockEntryService.registrarPonto(pontoParaRegistrar.tipo);
      
      console.log('');
      console.log('════════════════════════════════════════');
      console.log('✅ ✅ ✅ SUCESSO! Ponto registrado!');
      console.log('   ID:', resultado.id);
      console.log('   Tipo:', resultado.tipo);
      console.log('   Timestamp:', resultado.timestamp);
      console.log('════════════════════════════════════════');
      console.log('');
      
      const hora = clockEntryService.formatarHora(resultado.timestamp);
      
      setMensagemSucesso(`${pontoParaRegistrar.label} registrado às ${hora}`);
      setTimeout(() => setMensagemSucesso(null), 3000);
      
      console.log('🔵 Recarregando pontos...');
      await carregarPontosHoje();
      console.log('🔵 Pontos recarregados!');
    } catch (error: any) {
      console.log('');
      console.log('════════════════════════════════════════');
      console.log('❌ ❌ ❌ ERRO AO REGISTRAR PONTO');
      console.log('   Nome do erro:', error.name);
      console.log('   Mensagem:', error.message);
      console.log('   Status HTTP:', error.response?.status);
      console.log('   Data do servidor:', error.response?.data);
      console.log('   URL:', error.config?.url);
      console.log('   Método:', error.config?.method);
      console.log('   Headers enviados:', error.config?.headers);
      console.log('════════════════════════════════════════');
      console.log('');
      
      // Extrair mensagem de erro do backend
      let mensagemTexto = 'Ocorreu um erro ao registrar o ponto';
      let tituloErro = '❌ Erro ao Registrar Ponto';
      
      // Tratamento especial para erro 401
      if (error.response?.status === 401) {
        tituloErro = '🔐 Sessão Expirada';
        mensagemTexto = 'Sua sessão expirou. Por favor, faça login novamente.';
      } else if (error.response?.data?.message) {
        // Mensagem vinda do backend
        mensagemTexto = error.response.data.message;
        
        // Personalizar título baseado no tipo de erro
        if (mensagemTexto.includes('já existe') || mensagemTexto.includes('sem EXIT')) {
          tituloErro = '⚠️ Ponto Inválido';
        } else if (mensagemTexto.includes('localização') || mensagemTexto.includes('perímetro')) {
          tituloErro = '📍 Erro de Localização';
        } else if (mensagemTexto.includes('almoço')) {
          tituloErro = '🍽️ Erro de Almoço';
        }
      } else if (error.message) {
        mensagemTexto = error.message;
      }
      
      // Mostrar mensagem de erro flutuante (visual)
      setMensagemErro(`${tituloErro}: ${mensagemTexto}`);
      setTimeout(() => setMensagemErro(null), 5000); // 5 segundos
      
      // Também mostrar Alert para garantir que o usuário veja
      Alert.alert(tituloErro, mensagemTexto, [
        { text: 'OK', style: 'default' }
      ]);
    } finally {
      setPontoParaRegistrar(null);
      setRegistrandoPonto(false);
    }
  };

  const cancelarRegistroPonto = () => {
    console.log('🔵 Usuário cancelou');
    setModalConfirmacao(false);
    setPontoParaRegistrar(null);
    setRegistrandoPonto(false);
  };

  // Agrupa pontos por dia
  const agruparPontosPorDia = (pontos: ClockEntryResponse[]) => {
    const grupos: { [data: string]: ClockEntryResponse[] } = {};
    
    pontos.forEach(ponto => {
      const data = clockEntryService.formatarData(ponto.timestamp);
      if (!grupos[data]) {
        grupos[data] = [];
      }
      grupos[data].push(ponto);
    });

    return grupos;
  };

  // Calcula numeração sequencial por tipo
  const obterNumeroSequencial = (pontosNoDia: ClockEntryResponse[], pontoAtual: ClockEntryResponse) => {
    const tipo = pontoAtual.tipo;
    const pontosMesmoTipo = pontosNoDia.filter(p => p.tipo === tipo);
    const indice = pontosMesmoTipo.findIndex(p => p.id === pontoAtual.id);
    return indice + 1;
  };

  const renderBotaoPonto = (
    tipo: ClockEntryType,
    label: string,
    icon: string,
    color: string
  ) => (
    <TouchableOpacity
      key={tipo}
      style={[
        styles.botaoPonto,
        { backgroundColor: color },
        registrandoPonto && styles.botaoDesabilitado
      ]}
      onPress={() => {
        console.log('🟢 TouchableOpacity pressionado - Label:', label, 'Tipo:', tipo);
        registrarPonto(tipo);
      }}
      disabled={registrandoPonto}
      activeOpacity={0.7}
    >
      <Ionicons name={icon as any} size={32} color="white" />
      <Text style={styles.botaoPontoTexto}>{label}</Text>
    </TouchableOpacity>
  );

  const renderPontoItem = (ponto: ClockEntryResponse, pontosNoDia: ClockEntryResponse[], index: number) => {
    const hora = clockEntryService.formatarHora(ponto.timestamp);
    const tipo = clockEntryService.formatarTipoPonto(ponto.tipo as ClockEntryType);
    const cor = clockEntryService.getCorPonto(ponto.tipo as ClockEntryType);
    const icone = clockEntryService.getIconePonto(ponto.tipo as ClockEntryType);
    const showLocation = mostrarLocalizacao[ponto.id];
    const numeroSequencial = obterNumeroSequencial(pontosNoDia, ponto);
    const tipoComNumero = `${tipo} ${numeroSequencial}`;

    return (
      <TouchableOpacity 
        key={`ponto-${ponto.id}-${index}`}
        style={styles.pontoItem}
        onPress={() => toggleLocalizacao(ponto.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.pontoIcone, { backgroundColor: cor }]}>
          <Ionicons name={icone as any} size={24} color="white" />
        </View>
        <View style={styles.pontoInfo}>
          {isAdmin && (
            <Text style={styles.pontoUserId}>Usuário ID: {ponto.userId}</Text>
          )}
          <Text style={styles.pontoTipo}>{tipoComNumero}</Text>
          <Text style={styles.pontoHora}>{hora}</Text>
          
          {showLocation && (
            <View style={styles.localizacaoContainer}>
              <View style={styles.localizacaoRow}>
                <Ionicons name="location" size={14} color="#666" />
                <Text style={styles.localizacaoTexto}>
                  Lat: {ponto.latitude.toFixed(6)}
                </Text>
              </View>
              <View style={styles.localizacaoRow}>
                <Ionicons name="location" size={14} color="#666" />
                <Text style={styles.localizacaoTexto}>
                  Lng: {ponto.longitude.toFixed(6)}
                </Text>
              </View>
              <Text style={styles.localizacaoTexto}>
                Precisão: {ponto.precisao.toFixed(0)}m
              </Text>
              <Text style={styles.localizacaoTexto}>
                Fonte: {ponto.fonte}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.pontoStatus}>
          <Ionicons 
            name={showLocation ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#666" 
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderHistoricoPontos = () => {
    const pontos = isAdmin ? todosOsPontos : pontosHoje;
    
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A4A8E" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      );
    }

    if (pontos.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>Nenhum ponto registrado</Text>
          <Text style={styles.emptySubtext}>
            {isAdmin ? 'Sem registros no histórico' : 'Registre sua entrada para começar'}
          </Text>
        </View>
      );
    }

    const grupos = agruparPontosPorDia(pontos);
    const datasOrdenadas = Object.keys(grupos).sort((a, b) => b.localeCompare(a));

    return (
      <View style={styles.pontosLista}>
        {datasOrdenadas.map((data) => (
          <View key={data} style={styles.grupoData}>
            <Text style={styles.dataHeader}>📅 {data}</Text>
            {grupos[data].map((ponto, index) => renderPontoItem(ponto, grupos[data], index))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.headerProfile} onPress={openModal}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons name="person" size={24} color="#FFFFFF" />
                </View>
              )}
              <View style={styles.headerTextContainer}>
                <Text style={styles.greeting}>Olá,</Text>
                <Text style={styles.username}>{userName}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.headerIconButton}
              onPress={() => console.log('Notificações')}
            >
              <Ionicons name="notifications-outline" size={28} color="#0A4A8E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botões de Registro */}
        <View style={styles.botoesContainer}>
          <View style={styles.botoesRow}>
            {renderBotaoPonto('ENTRY', 'Entrada', 'log-in', '#4CAF50')}
            {renderBotaoPonto('EXIT', 'Saída', 'log-out', '#F44336')}
          </View>
          <View style={styles.botoesRow}>
            {renderBotaoPonto('LUNCH_START', 'Início Almoço', 'restaurant', '#FF9800')}
            {renderBotaoPonto('LUNCH_END', 'Fim Almoço', 'restaurant-outline', '#2196F3')}
          </View>
        </View>

        {/* Histórico do Dia */}
        <View style={styles.historicoContainer}>
          <View style={styles.historicoHeader}>
            <Text style={styles.historicoTitulo}>
              {isAdmin ? 'Histórico de Pontos' : 'Pontos Registrados Hoje'}
            </Text>
            <TouchableOpacity onPress={carregarPontosHoje}>
              <Ionicons name="refresh" size={24} color="#0A4A8E" />
            </TouchableOpacity>
          </View>

          {renderHistoricoPontos()}
        </View>

        {/* Informações Adicionais */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color="#0A4A8E" />
          <Text style={styles.infoTexto}>
            Lembre-se de registrar todos os pontos durante o dia: entrada, saída e horários de almoço.
          </Text>
        </View>
      </ScrollView>

      {/* Mensagem de Sucesso Flutuante */}
      {mensagemSucesso && (
        <View style={styles.mensagemSucessoContainer}>
          <View style={styles.mensagemSucesso}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.mensagemSucessoTexto}>{mensagemSucesso}</Text>
          </View>
        </View>
      )}

      {/* Mensagem de Erro Flutuante */}
      {mensagemErro && (
        <View style={styles.mensagemErroContainer}>
          <View style={styles.mensagemErro}>
            <Ionicons name="close-circle" size={24} color="#F44336" />
            <Text style={styles.mensagemErroTexto}>{mensagemErro}</Text>
          </View>
        </View>
      )}

      {/* Modal de Confirmação */}
      <Modal
        visible={modalConfirmacao}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelarRegistroPonto}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="time-outline" size={40} color="#0A4A8E" />
              <Text style={styles.modalTitulo}>Confirmar Registro</Text>
            </View>
            
            <Text style={styles.modalMensagem}>
              Deseja registrar o ponto: {pontoParaRegistrar?.label}?
            </Text>

            <View style={styles.modalBotoes}>
              <TouchableOpacity 
                style={[styles.modalBotao, styles.modalBotaoCancelar]}
                onPress={cancelarRegistroPonto}
              >
                <Text style={styles.modalBotaoTextoCancelar}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalBotao, styles.modalBotaoConfirmar]}
                onPress={confirmarRegistroPonto}
              >
                <Text style={styles.modalBotaoTextoConfirmar}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
  },
  
  // Header
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  profileImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0A4A8E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A4A8E',
  },
  headerIconButton: {
    padding: 8,
  },

  // Botões de Ponto
  botoesContainer: {
    padding: 20,
    gap: 12,
  },
  botoesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  botaoPonto: {
    flex: 1,
    height: 85,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoPontoTexto: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },

  // Histórico
  historicoContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historicoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  historicoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A4A8E',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 4,
  },

  // Grupo de Data
  grupoData: {
    marginBottom: 20,
  },
  dataHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A4A8E',
    marginBottom: 12,
    marginLeft: 4,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },

  // Lista de Pontos
  pontosLista: {
    gap: 8,
  },
  pontoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
  },
  pontoIcone: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pontoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  pontoUserId: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
    fontStyle: 'italic',
  },
  pontoTipo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  pontoHora: {
    fontSize: 14,
    color: '#666',
  },
  localizacaoContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0A4A8E',
  },
  localizacaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  localizacaoTexto: {
    fontSize: 11,
    color: '#333',
    marginLeft: 6,
    fontFamily: 'monospace',
  },
  pontoStatus: {
    marginLeft: 12,
  },

  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0A4A8E',
  },
  infoTexto: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#0A4A8E',
    lineHeight: 20,
  },

  // Mensagem de Sucesso
  mensagemSucessoContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  mensagemSucesso: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  mensagemSucessoTexto: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },

  // Mensagem de Erro
  mensagemErroContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  mensagemErro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  mensagemErroTexto: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A4A8E',
    marginTop: 12,
  },
  modalMensagem: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBotao: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBotaoCancelar: {
    backgroundColor: '#F5F5F5',
  },
  modalBotaoConfirmar: {
    backgroundColor: '#0A4A8E',
  },
  modalBotaoTextoCancelar: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalBotaoTextoConfirmar: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
