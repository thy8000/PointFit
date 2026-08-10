import React from 'react'
import { View, ScrollView, Pressable, Linking } from 'react-native'
import { useAuth } from '../../hooks/useAuth'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Typography } from '../../components/ui/Typography'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { REPDB_ATTRIBUTION_URL } from '../../utils/constants'

export function ProfileScreen() {
  const { user, logout } = useAuth()
  const insets = useSafeAreaInsets()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <ScrollView
      className="flex-1 bg-surface-dark"
      contentContainerStyle={{ padding: 24, paddingTop: insets.top + 16 }}
    >
      <Card style={{ alignItems: 'center', padding: 24 }}>
        <View className="w-20 h-20 rounded-full bg-primary items-center justify-center" style={{ marginBottom: 12 }}>
          <Typography variant="h2">{user?.name?.charAt(0)?.toUpperCase() ?? '?'}</Typography>
        </View>
        <Typography variant="h3">{user?.name}</Typography>
        <Typography variant="caption" style={{ marginTop: 4 }}>{user?.email}</Typography>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Typography variant="h3" style={{ marginBottom: 8 }}>Sobre</Typography>
        <Typography variant="body" style={{ color: '#cbd5e1' }}>
          PointFit é um app de musculação com foco em progressão de carga.
        </Typography>
        <Pressable
          onPress={() => Linking.openURL(REPDB_ATTRIBUTION_URL)}
          style={{ marginTop: 12 }}
        >
          <Typography variant="body" style={{ fontSize: 14, color: '#94a3b8' }}>
            Exercise data by{' '}
            <Typography variant="body" style={{ color: '#60a5fa' }}>
              RepDB (repdb.co)
            </Typography>
          </Typography>
        </Pressable>
      </Card>

      <Button
        variant="outline"
        title="Sair da conta"
        onPress={handleLogout}
        fullWidth
        style={{ marginTop: 24 }}
      />
    </ScrollView>
  )
}