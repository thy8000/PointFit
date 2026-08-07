import { database } from './database'
import type { Model } from '@nozbe/watermelondb'
import { client } from '../api/client'
import { EXERCISES_QUERY } from '../api/queries/exercises.queries'
import type { Exercise, ExerciseFilters } from '../types/graphql'

const EXERCISES_TABLE = 'exercises'

const serialize = (json: string[] | null | undefined): string | null =>
  json && json.length > 0 ? JSON.stringify(json) : null

/**
 * Busca exercícios na API e sincroniza com o banco local (WatermelonDB).
 * Pode ser chamado ao abrir o app e em pull-to-refresh.
 */
export async function syncExercises(filters: ExerciseFilters = {}): Promise<number> {
  const { data } = await client.query<{ exercises: Exercise[] }>({
    query: EXERCISES_QUERY,
    variables: { ...filters, limit: filters.limit ?? 50 },
    fetchPolicy: 'network-only',
  })

  const now = Date.now()
  const collection = database.get<import('../models').ExerciseModel>(EXERCISES_TABLE)

  await database.write(async () => {
    const existing = await collection.query().fetch()
    const existingByDatasetId = new Map(
      existing
        .filter((item) => item.datasetId != null)
        .map((item) => [item.datasetId as string, item] as const),
    )

    const actions: Model[] = []
    const changed = new Set<string>()

    for (const exercise of data.exercises) {
      const datasetId = exercise.id
      const record = existingByDatasetId.get(datasetId)

      const raw = {
        name: exercise.name,
        description: exercise.description ?? null,
        muscle_group: exercise.muscleGroup,
        equipment: exercise.equipment,
        thumbnail_url: exercise.thumbnailUrl ?? null,
        image_start: exercise.imageStart ?? null,
        image_peak: exercise.imagePeak ?? null,
        image_main: exercise.imageMain ?? null,
        is_custom: exercise.isCustom,
        category: exercise.category ?? null,
        difficulty: exercise.difficulty ?? null,
        primary_muscles: serialize(exercise.primaryMuscles),
        secondary_muscles: serialize(exercise.secondaryMuscles),
        goals: serialize(exercise.goals),
        tags: serialize(exercise.tags),
        met: exercise.met ?? null,
        is_unilateral: exercise.isUnilateral,
        is_bodyweight: exercise.isBodyweight,
        instructions_en: serialize(exercise.instructionsEn),
        instructions_de: serialize(exercise.instructionsDe),
        instructions_es: serialize(exercise.instructionsEs),
        tips_en: serialize(exercise.tipsEn),
        tips_de: serialize(exercise.tipsDe),
        tips_es: serialize(exercise.tipsEs),
        dataset_id: datasetId,
        updated_at: now,
      }

      if (record) {
        if (!changed.has(datasetId)) {
          actions.push(record.prepareUpdate(() => raw))
          changed.add(datasetId)
        }
      } else {
        actions.push(collection.prepareCreate(() => raw))
      }
    }

    if (actions.length > 0) {
      await database.batch(...actions)
    }
  })

  return data.exercises.length
}

/** Lista exercícios direto do banco local (funciona offline). */
export function getLocalExercises() {
  return database
    .get<import('../models').ExerciseModel>(EXERCISES_TABLE)
    .query()
    .fetch()
}