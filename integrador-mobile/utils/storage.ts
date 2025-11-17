/**
 * Helpers para armazenamento seguro (SecureStore e AsyncStorage)
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Armazena dados sensíveis de forma segura (tokens, senhas)
 */
export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Erro ao salvar ${key} no SecureStore:`, error);
      throw error;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Erro ao buscar ${key} do SecureStore:`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Erro ao deletar ${key} do SecureStore:`, error);
      throw error;
    }
  },

  async clear(): Promise<void> {
    // SecureStore não tem método clear, precisa deletar um por um
    console.warn('SecureStore não suporta clear global');
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
