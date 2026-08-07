import 'react-native-gesture-handler'
import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ApolloProvider } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import { client } from './api/client'
import { useAuth } from './hooks/useAuth'
import { AuthNavigator } from './navigation/AuthNavigator'
import { AppNavigator } from './navigation/AppNavigator'

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0f172a',
    card: '#0f172a',
    text: '#f8fafc',
    border: '#1e293b',
    primary: '#22c55e',
  },
}

function Root() {
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-dark">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    )
  }

  return (
    <NavigationContainer theme={navTheme}>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <StatusBar style="light" />
          <Root />
        </ApolloProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}