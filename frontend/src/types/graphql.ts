export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Arms'
  | 'Core'
  | 'Cardio'
  | 'FullBody'
  | 'Other'

export type EquipmentType =
  | 'Barbell'
  | 'Dumbbell'
  | 'Machine'
  | 'Bodyweight'
  | 'Cable'
  | 'Kettlebell'
  | 'Band'
  | 'Other'

export interface PublicUser {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthPayload {
  user: PublicUser
  token: string
}

export interface Exercise {
  id: string
  name: string
  description: string | null
  muscleGroup: MuscleGroup
  equipment: EquipmentType
  thumbnailUrl?: string | null
  imageStart?: string | null
  imagePeak?: string | null
  imageMain?: string | null
  isCustom: boolean
  category: string | null
  difficulty: string | null
  primaryMuscles: string[]
  secondaryMuscles: string[]
  goals: string[]
  tags: string[]
  met?: number | null
  isUnilateral: boolean
  isBodyweight: boolean
  instructionsEn: string[]
  instructionsDe: string[]
  instructionsEs: string[]
  tipsEn: string[]
  tipsDe: string[]
  tipsEs: string[]
}

export interface ExerciseFilters {
  muscleGroup?: MuscleGroup | null
  equipment?: EquipmentType | null
  search?: string | null
  difficulty?: string | null
  category?: string | null
  limit?: number | null
  offset?: number | null
}