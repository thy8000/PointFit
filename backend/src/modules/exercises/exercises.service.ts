import type { ExerciseLibrary, MuscleGroup, EquipmentType } from '@prisma/client'
import { prisma } from '../../shared/database/prisma.client'
import { NotFoundError } from '../../shared/errors/app-error'

export interface ExerciseFilters {
  muscleGroup?: MuscleGroup
  equipment?: EquipmentType
  search?: string
  difficulty?: string
  category?: string
  limit?: number
  offset?: number
}

export class ExercisesService {
  async list(filters: ExerciseFilters): Promise<ExerciseLibrary[]> {
    const { muscleGroup, equipment, search, difficulty, category } = filters

    const where: Record<string, unknown> = {}
    if (muscleGroup) where.muscleGroup = muscleGroup
    if (equipment) where.equipment = equipment
    if (difficulty) where.difficulty = difficulty
    if (category) where.category = category
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { primaryMuscles: { has: search.toLowerCase() } },
        { tags: { has: search.toLowerCase() } },
      ]
    }

    return prisma.exerciseLibrary.findMany({
      where,
      orderBy: { name: 'asc' },
      take: Math.min(filters.limit ?? 50, 100),
      skip: filters.offset ?? 0,
    })
  }

  async getById(id: string): Promise<ExerciseLibrary> {
    const exercise = await prisma.exerciseLibrary.findUnique({ where: { id } })
    if (!exercise) {
      throw new NotFoundError('Exercício não encontrado')
    }
    return exercise
  }

  async getByDatasetId(datasetId: string): Promise<ExerciseLibrary | null> {
    return prisma.exerciseLibrary.findUnique({ where: { datasetId } })
  }

  async count(): Promise<number> {
    return prisma.exerciseLibrary.count()
  }
}