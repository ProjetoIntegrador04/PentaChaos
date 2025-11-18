/**
 * Storage Service - Abstração de armazenamento multiplataforma
 * 
 * - Web: usa AsyncStorage (LocalStorage do navegador)
 * - iOS/Android: usa SecureStore (armazenamento criptografado nativo)
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * Salva um item no armazenamento
 * @param key - Chave do item
 * @param value - Valor a ser salvo (string)
 */
export async function saveItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      // Web: usa AsyncStorage (LocalStorage)
      await AsyncStorage.setItem(key, value);
      console.log(`✅ [Web] Item salvo: ${key}`);
    } else {
      // iOS/Android: usa SecureStore (criptografado)
      await SecureStore.setItemAsync(key, value);
      console.log(`✅ [Mobile] Item salvo de forma segura: ${key}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao salvar item ${key}:`, error);
    throw error;
  }
}

/**
 * Recupera um item do armazenamento
 * @param key - Chave do item
 * @returns Valor armazenado ou null se não existir
 */
export async function getItem(key: string): Promise<string | null> {
  try {
    let value: string | null = null;

    if (Platform.OS === 'web') {
      // Web: usa AsyncStorage (LocalStorage)
      value = await AsyncStorage.getItem(key);
    } else {
      // iOS/Android: usa SecureStore (criptografado)
      value = await SecureStore.getItemAsync(key);
    }

    if (value) {
      console.log(`✅ Item recuperado: ${key}`);
    } else {
      console.log(`⚠️ Item não encontrado: ${key}`);
    }

    return value;
  } catch (error) {
    console.error(`❌ Erro ao recuperar item ${key}:`, error);
    return null;
  }
}

/**
 * Remove um item do armazenamento
 * @param key - Chave do item a ser removido
 */
export async function deleteItem(key: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      // Web: usa AsyncStorage (LocalStorage)
      await AsyncStorage.removeItem(key);
      console.log(`✅ [Web] Item removido: ${key}`);
    } else {
      // iOS/Android: usa SecureStore (criptografado)
      await SecureStore.deleteItemAsync(key);
      console.log(`✅ [Mobile] Item removido: ${key}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao remover item ${key}:`, error);
    throw error;
  }
}

/**
 * Limpa todos os itens do armazenamento
 * ⚠️ Use com cuidado!
 */
export async function clearAll(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.clear();
      console.log('✅ [Web] Todo o armazenamento foi limpo');
    } else {
      // No SecureStore não existe clear(), então limpamos manualmente
      // as chaves conhecidas da aplicação
      const keys = ['access_token', 'refresh_token', 'user_data'];
      await Promise.all(keys.map(key => SecureStore.deleteItemAsync(key)));
      console.log('✅ [Mobile] Tokens de autenticação removidos');
    }
  } catch (error) {
    console.error('❌ Erro ao limpar armazenamento:', error);
    throw error;
  }
}

// Export como objeto para manter compatibilidade
export default {
  saveItem,
  getItem,
  deleteItem,
  clearAll,
};
