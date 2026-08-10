import { ExercisesService } from './exercises.service'
import type { GraphQLContext } from '../../graphql/context'

const exercisesService = new ExercisesService()

interface ExerciseArgs {
  id: string
  datasetId: string
  muscleGroup: string
  equipment: string
  search: string
  difficulty: string
  category: string
  limit: number
  offset: number
}

export const exercisesResolvers = {
  Query: {
    exercises: async (_: unknown, args: Partial<ExerciseArgs>, _ctx: GraphQLContext) => {
      return exercisesService.list({
        muscleGroup: args.muscleGroup as never,
        equipment: args.equipment as never,
        search: args.search,
        difficulty: args.difficulty,
        category: args.category,
        limit: args.limit,
        offset: args.offset,
      })
    },
    exercise: async (_: unknown, args: Pick<ExerciseArgs, 'id'>) => {
      return exercisesService.getById(args.id)
    },
    exerciseByDatasetId: async (_: unknown, args: Pick<ExerciseArgs, 'datasetId'>) => {
      return exercisesService.getByDatasetId(args.datasetId)
    },
  },
}