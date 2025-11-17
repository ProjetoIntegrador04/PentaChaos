/**
 * Tela de Registro de Ponto (Clock Entry)
 * Permite o usuário bater ponto com geolocalização
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import clockEntryService from '../services/clockentry.service';
import { ClockEntryResponse, ClockEntryType } from '../types/clockentry.types';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';

export default function ClockEntryScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [historico, setHistorico] = useState<ClockEntryResponse[]>([]);
  const [lastEntry, setLastEntry] = useState<ClockEntryResponse | null>(null);

  useEffect(() => {
    loadLocation();
    loadHistorico();
  }, []);

  /**
   * Carrega localização atual
   */
  const loadLocation = async () => {
    try {
      const hasPermission = await clockEntryService.verificarPermissaoLocalizacao();

      if (!hasPermission) {
        const granted = await clockEntryService.solicitarPermissaoLocalizacao();
        if (!granted) {
          Alert.alert(
            'Permissão Necessária',
            'Precisamos da sua localização para registrar o ponto.',
            [{ text: 'OK' }]
          );
          return;
        }
      }

      const loc = await clockEntryService.obterLocalizacaoAtual();
      setLocation(loc);
    } catch (error: any) {
      console.error('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível obter sua localização');
    }
  };

  /**
   * Carrega histórico de pontos
   */
  const loadHistorico = async () => {
    try {
      setRefreshing(true);
      const data = await clockEntryService.buscarHistorico();
      setHistorico(data);

      // Pega o último registro
      if (data.length > 0) {
        setLastEntry(data[0]);
      }
    } catch (error: any) {
      console.error('Erro ao carregar histórico:', error);
      // Não mostra erro se for 401 (não autenticado)
      if (error.response?.status !== 401) {
        Alert.alert('Erro', 'Não foi possível carregar o histórico');
      }
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Registra um ponto
   */
  const handleRegistrarPonto = async (tipo: ClockEntryType) => {
    try {
      setLoading(true);

      // Verifica permissão novamente
      const hasPermission = await clockEntryService.verificarPermissaoLocalizacao();
      if (!hasPermission) {
        Alert.alert('Erro', 'Permissão de localização necessária');
        return;
      }

      // Registra o ponto
      await clockEntryService.registrarPonto(tipo);

      Alert.alert(
        'Sucesso!',
        `${clockEntryService.formatarTipoPonto(tipo)} registrado com sucesso!`,
        [{ text: 'OK' }]
      );

      // Recarrega histórico
      await loadHistorico();
    } catch (error: any) {
      console.error('Erro ao registrar ponto:', error);

      let errorMessage = 'Erro ao registrar ponto';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Determina qual botão mostrar baseado no último ponto
   */
  const getNextAction = (): { tipo: ClockEntryType; label: string; icon: string } => {
    if (!lastEntry) {
      return { tipo: 'ENTRY', label: 'Entrada', icon: 'log-in' };
    }

    switch (lastEntry.tipo) {
      case 'ENTRY':
        return { tipo: 'LUNCH_START', label: 'Início do Almoço', icon: 'restaurant' };
      case 'LUNCH_START':
        return { tipo: 'LUNCH_END', label: 'Fim do Almoço', icon: 'restaurant-outline' };
      case 'LUNCH_END':
        return { tipo: 'EXIT', label: 'Saída', icon: 'log-out' };
      case 'EXIT':
        return { tipo: 'ENTRY', label: 'Entrada', icon: 'log-in' };
      default:
        return { tipo: 'ENTRY', label: 'Entrada', icon: 'log-in' };
    }
  };

  const nextAction = getNextAction();

  /**
   * Formata data/hora para exibição
   */
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadHistorico} colors={['#0A4A8E']} />
        }
      >
        {/* Cabeçalho */}
        <LinearGradient colors={['#0A4A8E', '#2a77d4']} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Registro de Ponto</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>

        {/* Informações do Usuário */}
        <View style={styles.userInfo}>
          <FontAwesome5 name="user-circle" size={40} color="#0A4A8E" />
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>{user?.username || 'Usuário'}</Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
          </View>
        </View>

        {/* Mapa (se houver localização) */}
        {location && (
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="Você está aqui"
              />
            </MapView>
            <Text style={styles.locationText}>
              📍 Lat: {location.latitude.toFixed(6)}, Lon: {location.longitude.toFixed(6)}
            </Text>
          </View>
        )}

        {/* Botões de Ação */}
        <View style={styles.actionButtonsContainer}>
          <Text style={styles.sectionTitle}>Registrar Ponto</Text>

          {/* Botão Principal */}
          <TouchableOpacity
            style={[styles.mainButton, loading && styles.buttonDisabled]}
            onPress={() => handleRegistrarPonto(nextAction.tipo)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : (
              <>
                <Ionicons name={nextAction.icon as any} size={32} color="white" />
                <Text style={styles.mainButtonText}>{nextAction.label}</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Último Registro */}
          {lastEntry && (
            <View style={styles.lastEntryCard}>
              <Text style={styles.lastEntryTitle}>Último Registro</Text>
              <View style={styles.lastEntryRow}>
                <Ionicons name="time" size={20} color="#0A4A8E" />
                <Text style={styles.lastEntryText}>
                  {clockEntryService.formatarTipoPonto(lastEntry.tipo)} -{' '}
                  {formatDateTime(lastEntry.timestamp)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Histórico Resumido */}
        <View style={styles.historicoSection}>
          <View style={styles.historicoHeader}>
            <Text style={styles.sectionTitle}>Histórico</Text>
            <TouchableOpacity onPress={loadHistorico}>
              <Ionicons name="refresh" size={24} color="#0A4A8E" />
            </TouchableOpacity>
          </View>

          {historico.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum registro de ponto ainda</Text>
          ) : (
            historico.slice(0, 5).map((entry, index) => (
              <View key={`history-${entry.id}-${index}`} style={styles.historicoItem}>
                <View style={styles.historicoIcon}>
                  <Ionicons
                    name={
                      entry.tipo === 'ENTRY'
                        ? 'log-in'
                        : entry.tipo === 'EXIT'
                        ? 'log-out'
                        : 'restaurant'
                    }
                    size={20}
                    color="#0A4A8E"
                  />
                </View>
                <View style={styles.historicoTextContainer}>
                  <Text style={styles.historicoTipo}>
                    {clockEntryService.formatarTipoPonto(entry.tipo)}
                  </Text>
                  <Text style={styles.historicoTime}>{formatDateTime(entry.timestamp)}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userTextContainer: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  mapContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  map: {
    width: '100%',
    height: 200,
  },
  locationText: {
    backgroundColor: 'white',
    padding: 10,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  actionButtonsContainer: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  mainButton: {
    backgroundColor: '#0A4A8E',
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 100,
  },
  buttonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
  mainButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  lastEntryCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#0A4A8E',
  },
  lastEntryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  lastEntryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastEntryText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  historicoSection: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 30,
  },
  historicoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
    padding: 20,
  },
  historicoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historicoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F4FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historicoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  historicoTipo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historicoTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
