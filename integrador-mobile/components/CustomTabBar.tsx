import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, Ionicons, Foundation, AntDesign } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// Interface para definir o formato de cada item da configuração
interface TabConfigItem {
  icon: (color: string) => React.ReactNode;
  label: string;
}

// Mapeamento dos nomes das rotas para ícones e textos
const tabConfig: { [key: string]: TabConfigItem } = {
  ranking: { icon: (color: string) => <Foundation name="graph-trend" size={24} color={color} />, label: 'Ranking' },
  squads: { icon: (color: string) => <FontAwesome5 name="users" size={24} color={color} />, label: 'Squads' },
  home: { icon: (color: string) => <Ionicons name="home-outline" size={32} color={color} />, label: 'Home' },
  usuarios: { icon: (color: string) => <AntDesign name="solution1" size={24} color={color} />, label: 'Usuários' },
  notificacoes: { icon: (color: string) => <Ionicons name="notifications-outline" size={24} color={color} />, label: 'Notificações' },
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const color = isFocused ? '#1E63B0' : '#b0b0b0';
        
        const tabInfo = tabConfig[route.name] || { icon: () => null, label: '' };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Renderiza o botão central de forma diferente
        if (route.name === 'home') {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.centerButtonContainer}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
            >
              <View style={styles.centerButton}>
                {tabInfo.icon(color)}
              </View>
            </TouchableOpacity>
          );
        }

        // Renderiza os outros botões
        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
          >
            {tabInfo.icon(color)}
            <Text style={{ color, fontSize: 10 }}>{tabInfo.label}</Text>
            {isFocused && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 25, // Puxa o botão para cima
    borderColor: '#f0f0f0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  activeIndicator: {
    height: 3,
    width: 25,
    backgroundColor: '#1E63B0',
    position: 'absolute',
    top: 0,
  }
});