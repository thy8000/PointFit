import React from 'react'
import { Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeScreen } from '../screens/App/HomeScreen'
import { ExercisesScreen } from '../screens/App/ExercisesScreen'
import { ProfileScreen } from '../screens/App/ProfileScreen'
import type { AppTabParamList } from './types'

const Tab = createBottomTabNavigator<AppTabParamList>()

function tabLabel(name: string) {
  return ({ color }: { color: string; focused: boolean }) => (
    <Text style={{ color, fontSize: 12, fontWeight: '600' }}>{name}</Text>
  )
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#f8fafc',
        tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1e293b' },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#64748b',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: tabLabel('Início'), headerShown: false }}
      />
      <Tab.Screen
        name="Exercises"
        component={ExercisesScreen}
        options={{ tabBarLabel: tabLabel('Exercícios') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: tabLabel('Perfil') }}
      />
    </Tab.Navigator>
  )
}