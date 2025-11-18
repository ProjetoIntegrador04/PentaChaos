/**
 * Serviço de Registro de Ponto (Clock Entry)
 * Gerencia entrada/saída, almoço e histórico de pontos
 */

import api from './api';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { API_ENDPOINTS } from '../utils/constants';
import {
  ClockEntryRequest,
  ClockEntryResponse,
  ClockEntryType,
  FonteType,
} from '../types/clockentry.types';

class ClockEntryService {
  /**
   * Registra um ponto (entrada, saída, almoço)
   */
  async registrarPonto(tipo: ClockEntryType): Promise<ClockEntryResponse> {
    try {
      // 1. Solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permissão de localização negada. Ative nas configurações.');
      }

      // 2. Obter localização atual com alta precisão
      console.log('📍 Obtendo localização...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // 3. Preparar dados do ponto
      const fonte: FonteType =
        Platform.OS === 'android' ? 'MOBILE_ANDROID' : 'MOBILE_IOS';

      const deviceId =
        Device.osInternalBuildId || Device.modelId || 'unknown_device';

      const request: ClockEntryRequest = {
        tipo,
        timestamp: new Date().toISOString(),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        precisao: location.coords.accuracy || 0,
        fonte,
        deviceId,
      };

      console.log('📤 Enviando registro de ponto:', request);

      // 4. Enviar para o backend
      const response = await api.post<ClockEntryResponse>(
        API_ENDPOINTS.CLOCKENTRY.BASE,
        request
      );

      console.log('✅ Ponto registrado com sucesso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao registrar ponto:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Busca histórico de pontos do usuário
   */
  async buscarHistorico(): Promise<ClockEntryResponse[]> {
    try {
      const response = await api.get<ClockEntryResponse[]>(
        API_ENDPOINTS.CLOCKENTRY.BASE
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
}

export default new ClockEntryService();
