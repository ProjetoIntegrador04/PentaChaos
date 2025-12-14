/**
 * Serviço de Registro de Ponto (Clock Entry)
 * Gerencia entrada/saída, almoço e histórico de pontos
 */

import api from './api';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';
import { secureStorage } from '../utils/storage';
import {
  ClockEntryRequest,
  ClockEntryResponse,
  ClockEntryType,
  FonteType,
} from '../types/clockentry.types';

class ClockEntryService {
  /**
   * Registra um ponto (entrada, saída, almoço)
   * VERSÃO SIMPLIFICADA E CORRIGIDA
   */
  async registrarPonto(tipo: ClockEntryType): Promise<ClockEntryResponse> {
    try {
      console.log('🔵 [1/4] Iniciando registro de ponto:', tipo);

      // 1. Solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permissão de localização negada. Ative nas configurações.');
      }
      console.log('✅ [2/4] Permissão de localização OK');

      // 2. Obter localização atual com alta precisão
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      console.log('✅ [3/4] Localização obtida:', location.coords.latitude, location.coords.longitude);

      // 3. Preparar dados do ponto
      const fonte: FonteType = Platform.OS === 'android' ? 'MOBILE_ANDROID' : 
                               Platform.OS === 'ios' ? 'MOBILE_IOS' : 'WEB';

      const deviceId = Device.osInternalBuildId || Device.modelId || 'web_device';

      const request: ClockEntryRequest = {
        tipo,
        timestamp: new Date().toISOString(),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        precisao: location.coords.accuracy || 0,
        fonte,
        deviceId,
      };

      console.log('📤 [4/4] Enviando para backend:', {
        tipo: request.tipo,
        timestamp: request.timestamp,
        fonte: request.fonte
      });

      // 4. Enviar para o backend
      const response = await api.post<ClockEntryResponse>(
        API_ENDPOINTS.CLOCKENTRY.BASE,
        request
      );

      console.log('✅ ✅ ✅ Ponto registrado com sucesso!', response.data.id);
      return response.data;
    } catch (error: any) {
      console.error('❌ ❌ ❌ Erro ao registrar ponto:');
      console.error('   Status:', error.response?.status);
      console.error('   Mensagem:', error.response?.data?.message || error.message);
      console.error('   URL:', error.config?.url);
      console.error('   Headers:', error.config?.headers);
      throw error;
    }
  }

  /**
   * Busca pontos do usuário registrados hoje
   */
  async buscarPontosHoje(): Promise<ClockEntryResponse[]> {
    try {
      const response = await api.get<ClockEntryResponse[]>(
        API_ENDPOINTS.CLOCKENTRY.ME_TODAY
      );
      console.log(`✅ Pontos de hoje carregados: ${response.data.length} registros`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar pontos de hoje:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Busca histórico de pontos do usuário com filtro de data
   */
  async buscarHistorico(startDate?: string, endDate?: string): Promise<ClockEntryResponse[]> {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get<ClockEntryResponse[]>(
        API_ENDPOINTS.CLOCKENTRY.ME_HISTORY,
        { params }
      );
      console.log(`✅ Histórico carregado: ${response.data.length} registros`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar histórico:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Busca um ponto específico por ID
   */
  async buscarPontoPorId(id: number): Promise<ClockEntryResponse> {
    try {
      const response = await api.get<ClockEntryResponse>(
        API_ENDPOINTS.CLOCKENTRY.BY_ID(id)
      );
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erro ao buscar ponto ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Verifica o status da permissão de localização
   */
  async verificarPermissaoLocalizacao(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('❌ Erro ao verificar permissão:', error);
      return false;
    }
  }

  /**
   * Solicita permissão de localização
   */
  async solicitarPermissaoLocalizacao(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('❌ Erro ao solicitar permissão:', error);
      return false;
    }
  }

  /**
   * Obtém a localização atual (para testes/visualização)
   */
  async obterLocalizacaoAtual() {
    try {
      const hasPermission = await this.verificarPermissaoLocalizacao();
      if (!hasPermission) {
        throw new Error('Permissão de localização necessária');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      };
    } catch (error: any) {
      console.error('❌ Erro ao obter localização:', error.message);
      throw error;
    }
  }

  /**
   * Formata o tipo de ponto para exibição
   */
  formatarTipoPonto(tipo: ClockEntryType): string {
    const tipos: Record<ClockEntryType, string> = {
      ENTRY: 'Entrada',
      EXIT: 'Saída',
      LUNCH_START: 'Início do Almoço',
      LUNCH_END: 'Fim do Almoço',
    };
    return tipos[tipo] || tipo;
  }

  /**
   * Formata timestamp para exibição (HH:mm)
   */
  formatarHora(timestamp: string): string {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Formata data completa para exibição
   */
  formatarData(timestamp: string): string {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Retorna ícone baseado no tipo de ponto
   */
  getIconePonto(tipo: ClockEntryType): string {
    const icones: Record<ClockEntryType, string> = {
      ENTRY: 'log-in',
      EXIT: 'log-out',
      LUNCH_START: 'restaurant',
      LUNCH_END: 'restaurant-outline',
    };
    return icones[tipo] || 'time';
  }

  /**
   * Retorna cor baseada no tipo de ponto
   */
  getCorPonto(tipo: ClockEntryType): string {
    const cores: Record<ClockEntryType, string> = {
      ENTRY: '#4CAF50', // Verde
      EXIT: '#F44336', // Vermelho
      LUNCH_START: '#FF9800', // Laranja
      LUNCH_END: '#2196F3', // Azul
    };
    return cores[tipo] || '#757575';
  }

  /**
   * Busca frequência do usuário autenticado do backend
   * @param days Número de dias (7, 30, 90)
   * @returns Percentual de frequência (0-100)
   */
  async buscarFrequencia(days: number = 30): Promise<number> {
    try {
      const response = await api.get(`${API_ENDPOINTS.CLOCKENTRY.BASE}/me/frequency?days=${days}`);
      return Math.round(response.data);
    } catch (error: any) {
      console.error('❌ Erro ao buscar frequência:', error);
      throw error;
    }
  }
}

export default new ClockEntryService();
