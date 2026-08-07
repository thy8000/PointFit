import React, { useEffect, useState } from 'react'
import { View, ScrollView, FlatList, Pressable, ActivityIndicator } from 'react-native'
import { useQuery } from '@apollo/client'
import { Image } from 'expo-image'
import { EXERCISES_QUERY } from '../../api/queries/exercises.queries'
import { syncExercises } from '../../db/sync'
import type { Exercise, ExerciseFilters, MuscleGroup } from '../../types/graphql'
import { Typography } from '../../components/ui/Typography'
import { Card } from '../../components/ui/Card'

interface ExercisesData {
  exercises: Exercise[]
}

const MUSCLE_GROUPS: Array<{ label: string; value: MuscleGroup | null }> = [
  { label: 'Todos', value: null },
  { label: 'Peito', value: 'Chest' },
  { label: 'Costas', value: 'Back' },
  { label: 'Pernas', value: 'Legs' },
  { label: 'Ombros', value: 'Shoulders' },
  { label: 'Braços', value: 'Arms' },
  { label: 'Core', value: 'Core' },
]

export function ExercisesScreen() {
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | null>(null)
  const [syncedCount, setSyncedCount] = useState<number>(0)

  const { data, loading, error, refetch } = useQuery<ExercisesData>(EXERCISES_QUERY, {
    variables: { muscleGroup, limit: 50 },
  })

  const exercises = data?.exercises ?? []

  useEffect(() => {
    const timer = setTimeout(() => {
      syncExercises({ muscleGroup, limit: 50 })
        .then((count) => setSyncedCount(count))
        .catch(() => {
          // sem conexão: mantém só o cache
        })
    }, 400)
    return () => clearTimeout(timer)
  }, [muscleGroup])

  const handleFilter = (value: MuscleGroup | null) => {
    setMuscleGroup(value)
    const filters: ExerciseFilters = { muscleGroup: value, limit: 50 }
    void refetch(filters)
  }

  return (
    <View className="flex-1 bg-surface-dark">
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
        >
          {MUSCLE_GROUPS.map((option) => {
            const selected = muscleGroup === option.value
            return (
              <Pressable
                key={option.label}
                onPress={() => handleFilter(option.value)}
                className={[
                  'rounded-full px-4 py-2',
                  selected ? 'bg-primary' : 'bg-slate-800',
                ].join(' ')}
              >
                <Typography
                  variant="label"
                  style={{ color: selected ? '#ffffff' : '#cbd5e1' }}
                >
                  {option.label}
                </Typography>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center p-6">
          <Typography variant="body" style={{ textAlign: 'center', color: '#f87171' }}>
            Não foi possível carregar os exercícios.
          </Typography>
          <Pressable onPress={() => handleFilter(muscleGroup)} style={{ marginTop: 16 }}>
            <Typography variant="label" style={{ color: '#818cf8' }}>Tentar novamente</Typography>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 96 }}
          onRefresh={() => handleFilter(muscleGroup)}
          refreshing={false}
          ListHeaderComponent={
            syncedCount > 0 ? (
              <Typography variant="caption" style={{ color: '#94a3b8', marginBottom: 12 }}>
                {syncedCount} exercícios disponíveis offline
              </Typography>
            ) : null
          }
          renderItem={({ item }) => <ExerciseCard exercise={item} />}
        />
      )}
    </View>
  )
}

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const hasArmory =
    exercise.thumbnailUrl || exercise.imageStart || exercise.imagePeak || exercise.imageMain

  return (
    <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 }}>
      {hasArmory ? (
        <Image
          source={{ uri: (exercise.thumbnailUrl || exercise.imageStart || exercise.imagePeak || exercise.imageMain) ?? undefined }}
          className="w-16 h-16 rounded-xl bg-slate-800"
          contentFit="cover"
          transition={150}
        />
      ) : (
        <View className="w-16 h-16 rounded-xl bg-slate-800 items-center justify-center">
          <Typography variant="caption">💪</Typography>
        </View>
      )}
      <View className="flex-1">
        <Typography variant="h3">{exercise.name}</Typography>
        <View className="flex-row mt-1" style={{ gap: 8 }}>
          <Typography variant="caption" style={{ color: '#818cf8' }}>
            {exercise.muscleGroup}
          </Typography>
          <Typography variant="caption" style={{ color: '#64748b' }}>
            {exercise.equipment}
          </Typography>
        </View>
      </View>
    </Card>
  )
}