import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import type { RootStackParamList, MainTabParamList } from './types';

import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import UserListScreen from '../screens/UserListScreen';
import SquadsScreen from '../screens/SquadsScreen';
import RankingScreen from '../screens/RankingScreen';
import NotificationsScreen from '../screens/NotificationsScreen';


import ProfileModal from '../components/ProfileModal';
import SettingsModal from '../components/SettingsModal';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabNavigator() {
  const [profileVisible, setProfileVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#2B73BB',
          tabBarInactiveTintColor: 'gray',
          headerLeft: () => (
            <TouchableOpacity onPress={() => setProfileVisible(true)} style={{ marginLeft: 15 }}>
              <Ionicons name="person-circle-outline" size={28} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => setSettingsVisible(true)} style={{ marginRight: 15 }}>
              <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
        />
        <Tab.Screen
          name="Usuários"
          component={UserListScreen}
          options={{ tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} /> }}
        />
        <Tab.Screen
          name="Squads"
          component={SquadsScreen}
          options={{ tabBarIcon: ({ color, size }) => <Ionicons name="ribbon" size={size} color={color} /> }}
        />
        <Tab.Screen
          name="Ranking"
          component={RankingScreen}
          options={{ tabBarIcon: ({ color, size }) => <Ionicons name="trophy" size={size} color={color} /> }}
        />
        <Tab.Screen
          name="Notificacoes"
          component={NotificationsScreen}
          options={{
            title: 'Notificações',
            tabBarIcon: ({ color, size }) => <Ionicons name="notifications" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>

      <ProfileModal visible={profileVisible} onClose={() => setProfileVisible(false)} />
      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </>
  );
}

export function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Loading">
      <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainApp" component={MainTabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}