// app/navigation/types.ts
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';

// Tipagem para o Navegador de Abas (a navbar)
export type MainTabParamList = {
  Dashboard: undefined; // 'undefined' significa que a rota não recebe parâmetros
  Usuários: undefined;
  Squads: undefined;
  Notificacoes: undefined;
  Ranking: undefined;
};

// Tipagem para o Navegador de Pilha (o fluxo principal)
export type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  MainApp: NavigatorScreenParams<MainTabParamList>; // MainApp contém o navegador de abas
};

// Tipagem para as props de cada tela do Stack principal
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Tipagem para as props de cada tela do Tab principal
export type MainTabScreenProps<T extends keyof MainTabParamList> = 
  BottomTabScreenProps<MainTabParamList, T>;

// Para garantir que o IntelliSense funcione corretamente em componentes dentro do TabNavigator
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}