import React, { useState } from 'react'
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useMutation } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import { LOGIN_MUTATION } from '../../api/mutations/auth.mutations'
import type { AuthPayload } from '../../types/graphql'
import type { AuthStackParamList } from '../../navigation/types'
import { useAuthStore } from '../../store/authStore'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Typography } from '../../components/ui/Typography'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

type Navigation = StackNavigationProp<AuthStackParamList, 'Login'>

interface LoginResponse {
  login: AuthPayload
}

const getErrorMessage = (error?: unknown): string | null => {
  if (!error) return null
  const graphQLErrors = (error as { graphQLErrors?: unknown[] }).graphQLErrors
  if (graphQLErrors && graphQLErrors.length > 0) {
    return String((graphQLErrors[0] as { message?: string }).message ?? 'Falha no login')
  }
  return 'Não foi possível conectar ao servidor'
}

export function LoginScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<Navigation>()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [login, { loading, error }] = useMutation<LoginResponse>(LOGIN_MUTATION)

  const handleSubmit = async () => {
    try {
      const { data } = await login({ variables: { email, password } })
      if (data?.login) {
        await setAuth(data.login.user, data.login.token)
      }
    } catch {
      // erro tratado pelo Apollo + mensagem abaixo
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface-dark"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ paddingTop: insets.top }}
    >
      <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
        <Typography variant="h1" style={{ textAlign: 'center', marginBottom: 8 }}>PointFit</Typography>
        <Typography
          variant="body"
          style={{ textAlign: 'center', color: '#94a3b8', marginBottom: 40 }}
        >
          Seu treino, seu progresso.
        </Typography>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          containerStyle={{ marginBottom: 16 }}
        />
        <Input
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          placeholder="••••••••"
          containerStyle={{ marginBottom: 20 }}
        />

        {error ? (
          <Typography variant="caption" style={{ color: '#f87171', marginBottom: 12 }}>
            {getErrorMessage(error)}
          </Typography>
        ) : null}

        <Button title="Entrar" onPress={handleSubmit} loading={loading} fullWidth />

        <View className="flex-row justify-center mt-6">
          <Typography variant="body" style={{ color: '#94a3b8' }}>Não tem conta? </Typography>
          <Button
            variant="ghost"
            title="Cadastre-se"
            onPress={() => navigation.navigate('Register')}
            style={{ paddingVertical: 0, paddingHorizontal: 4 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}