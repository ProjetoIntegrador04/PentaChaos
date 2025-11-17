/**
 * Context de Autenticação
 * Gerencia o estado global de autenticação do usuário
 */

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthContextType, LoginRequest, User } from '../types/auth.types';
import authService from '../services/auth.service';
import userService from '../services/user.service';
import { router } from 'expo-router';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Carrega os dados do usuário ao iniciar o app
   */
  useEffect(() => {
    loadUserData();
  }, []);

  /**
   * Carrega dados do usuário salvos localmente
   */
  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const isAuth = await authService.isAuthenticated();

      if (isAuth) {
        // Tenta carregar dados do usuário salvos
        const userData = await authService.getUserData();

        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          console.log('✅ Usuário carregado do cache:', userData.username);
        } else {
          // Se não tem cache, busca do backend
          try {
            const profile = await userService.getMyProfile();
            setUser(profile);
            setIsAuthenticated(true);
            await authService.saveUserData(profile);
            console.log('✅ Perfil carregado do backend:', profile.username);
          } catch (error) {
            console.warn('⚠️ Falha ao carregar perfil do backend');
            // Se falhar, desloga
            await authService.logout();
            setIsAuthenticated(false);
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados do usuário:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Faz login do usuário
   */
  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);

      // 1. Fazer login
      await authService.login(credentials);

      // 2. Buscar dados do usuário
      const profile = await userService.getMyProfile();

      // 3. Salvar dados localmente
      await authService.saveUserData(profile);

      // 4. Atualizar estado
      setUser(profile);
      setIsAuthenticated(true);

      console.log('✅ Login realizado com sucesso:', profile.username);
    } catch (error) {
      console.error('❌ Erro no login:', error);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Faz logout do usuário
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ Logout realizado');
      
      // Redireciona para login
      router.replace('/');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Atualiza os dados do usuário (útil após editar perfil)
   */
  const refreshAuth = async () => {
    try {
      const profile = await userService.getMyProfile();
      setUser(profile);
      await authService.saveUserData(profile);
      console.log('✅ Dados do usuário atualizados');
    } catch (error) {
      console.error('❌ Erro ao atualizar dados:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar o contexto de autenticação
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}

export default AuthContext;
