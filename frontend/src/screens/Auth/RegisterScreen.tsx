import React, { useState } from 'react'
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useMutation } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import { REGISTER_MUTATION } from '../../api/mutations/auth.mutations'
import type { AuthPayload } from '../../types/graphql'
import type { AuthStackParamList } from '../../navigation/types'
import { useAuthStore } from '../../store/authStore'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Typography } from '../../components/ui/Typography'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

type Navigation = StackNavigationProp<AuthStackParamList, 'Register'>

interface RegisterResponse {
  register: AuthPayload
}

const getErrorMessage = (error?: unknown): string | null => {
  if (!error) return null
  const graphQLErrors = (error as { graphQLErrors?: unknown[] }).graphQLErrors
  if (graphQLErrors && graphQLErrors.length > 0) {
    return String((graphQLErrors[0] as { message?: string }).message ?? 'Falha no cadastro')
  }
  return 'Não foi possível conectar ao servidor'
}

export function RegisterScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<Navigation>()
  const setAuth = useAuthStore((state) => state.setAuth)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [register, { loading, error }] = useMutation<RegisterResponse>(REGISTER_MUTATION)

  const handleSubmit = async () => {
    try {
      const { data } = await register({ variables: { name, email, password } })
      if (data?.register) {
        await setAuth(data.register.user, data.register.token)
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
        <Typography variant="h1" style={{ textAlign: 'center', marginBottom: 8 }}>Criar conta</Typography>
        <Typography
          variant="body"
          style={{ textAlign: 'center', color: '#94a3b8', marginBottom: 40 }}
        >
          Comece a registrar seus treinos.
        </Typography>

        <Input
          label="Nome"
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          containerStyle={{ marginBottom: 16 }}
        />
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
          autoComplete="password-new"
          placeholder="Mínimo 8 caracteres"
          containerStyle={{ marginBottom: 20 }}
        />

        {error ? (
          <Typography variant="caption" style={{ color: '#f87171', marginBottom: 12 }}>
            {getErrorMessage(error)}
          </Typography>
        ) : null}

        <Button title="Criar conta" onPress={handleSubmit} loading={loading} fullWidth />

        <View className="flex-row justify-center mt-6">
          <Typography variant="body" style={{ color: '#94a3b8' }}>Já tem conta? </Typography>
          <Button
            variant="ghost"
            title="Entrar"
            onPress={() => navigation.navigate('Login')}
            style={{ paddingVertical: 0, paddingHorizontal: 4 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}