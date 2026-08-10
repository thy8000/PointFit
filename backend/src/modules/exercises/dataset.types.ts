export interface DatasetExercise {
  id: string
  name_en: string
  name_de: string
  name_es: string
  description_en: string
  description_de: string
  description_es: string
  category: string
  force_type: string
  mechanic: string
  difficulty: string
  equipment: string | null
  body_part: string
  primary_muscles: string[]
  secondary_muscles: string[]
  goals: string[]
  tags: string[]
  is_unilateral: boolean
  is_bodyweight: boolean
  instructions_en: string[]
  instructions_de: string[]
  instructions_es: string[]
  tips_en: string[]
  tips_de: string[]
  tips_es: string[]
  met: number
  images: DatasetImages
}

export type DatasetImages =
  | { flat: { start: string; peak: string } }
  | { flat: { main: string } }

export interface ExerciseDataset {
  name: string
  homepage: string
  license: string
  schema_version: number
  count: number
  note: string
  exercises: DatasetExercise[]
}