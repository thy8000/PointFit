import React, { useEffect, useState } from 'react'
import { View, ScrollView } from 'react-native'
import { useAuth } from '../../hooks/useAuth'
import { getLocalExercises } from '../../db/sync'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Typography } from '../../components/ui/Typography'
import { Card } from '../../components/ui/Card'

export function HomeScreen() {
  const { user } = useAuth()
  const insets = useSafeAreaInsets()
  const [localCount, setLocalCount] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    getLocalExercises()
      .then((exercises) => {
        if (mounted) setLocalCount(exercises.length)
      })
      .catch(() => {
        if (mounted) setLocalCount(0)
      })
    return () => {
      mounted = false
    }
  }, [])

  const firstName = user?.name?.split(' ')[0] ?? 'atleta'

  return (
    <ScrollView
      className="flex-1 bg-surface-dark"
      contentContainerStyle={{ padding: 24, paddingTop: insets.top + 16 }}
    >
      <Typography variant="h1">Olá, {firstName} 👋</Typography>
      <Typography variant="body" style={{ color: '#94a3b8', marginTop: 4 }}>
        Bora treinar hoje?
      </Typography>

      <View className="flex-row mt-8" style={{ gap: 16 }}>
        <Card style={{ flex: 1, alignItems: 'center' }}>
          <Typography variant="h3">{localCount ?? '-'}</Typography>
          <Typography variant="caption" style={{ marginTop: 4 }}>exercícios offline</Typography>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center' }}>
          <Typography variant="h3">0</Typography>
          <Typography variant="caption" style={{ marginTop: 4 }}>treinos na semana</Typography>
        </Card>
      </View>

      <Card style={{ marginTop: 24 }}>
        <Typography variant="h3" style={{ marginBottom: 8 }}>Fase 1 ✅</Typography>
        <Typography variant="body" style={{ color: '#94a3b8' }}>
          Fundação pronta: autenticação JWT, banco PostgreSQL com 400+ exercícios
          do Exercise Dataset e cache offline com WatermelonDB.
        </Typography>
      </Card>
    </ScrollView>
  )
}