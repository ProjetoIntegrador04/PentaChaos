/**
 * Helpers para armazenamento seguro (SecureStore e AsyncStorage)
 * COM SUPORTE MULTIPLATAFORMA (Web + Mobile)
 */

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Armazena dados sensíveis de forma segura (tokens, senhas)
 * - Web: usa AsyncStorage (LocalStorage)
 * - iOS/Android: usa SecureStore (armazenamento criptografado)
 */
export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Web: usa AsyncStorage
        await AsyncStorage.setItem(key, value);
        console.log(`✅ [Web] ${key} salvo no AsyncStorage`);
      } else {
        // Mobile: usa SecureStore
        await SecureStore.setItemAsync(key, value);
        console.log(`✅ [Mobile] ${key} salvo no SecureStore`);
      }
    } catch (error) {
      console.error(`❌ Erro ao salvar ${key}:`, error);
      throw error;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        // Web: usa AsyncStorage
        return await AsyncStorage.getItem(key);
      } else {
        // Mobile: usa SecureStore
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error(`❌ Erro ao buscar ${key}:`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Web: usa AsyncStorage
        await AsyncStorage.removeItem(key);
        console.log(`✅ [Web] ${key} removido`);
      } else {
        // Mobile: usa SecureStore
        await SecureStore.deleteItemAsync(key);
        console.log(`✅ [Mobile] ${key} removido`);
      }
    } catch (error) {
      console.error(`❌ Erro ao deletar ${key}:`, error);
      throw error;
    }
  },

  async clear(): Promise<void> {
    if (Platform.OS === 'web') {
      // Web: limpa tudo no AsyncStorage
      await AsyncStorage.clear();
      console.log('✅ [Web] AsyncStorage limpo');
    } else {
      // Mobile: SecureStore não tem clear, aviso apenas
      console.warn('⚠️ SecureStore não suporta clear global. Use removeItem() para cada chave.');
    }
  },
};

/**
 * Armazena dados não sensíveis (preferências, cache)
 */
export const localStorage = {
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Erro ao salvar ${key} no AsyncStorage:`, error);
      throw error;
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Erro ao buscar ${key} do AsyncStorage:`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao deletar ${key} do AsyncStorage:`, error);
      throw error;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar AsyncStorage:', error);
      throw error;
    }
  },
};
