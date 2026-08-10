import { Model } from '@nozbe/watermelondb'
import { field, json, text } from '@nozbe/watermelondb/decorators'

const fallbackArray = (value: unknown): string[] => (Array.isArray(value) ? value : [])

export class ExerciseModel extends Model {
  static table = 'exercises'

  @text('name') name!: string
  @text('description') description!: string | null
  @text('muscle_group') muscleGroup!: string
  @text('equipment') equipment!: string
  @text('thumbnail_url') thumbnailUrl!: string | null
  @text('image_start') imageStart!: string | null
  @text('image_peak') imagePeak!: string | null
  @text('image_main') imageMain!: string | null
  @field('is_custom') isCustom!: boolean
  @text('category') category!: string | null
  @text('difficulty') difficulty!: string | null

  @json('primary_muscles', fallbackArray) primaryMuscles!: string[]
  @json('secondary_muscles', fallbackArray) secondaryMuscles!: string[]
  @json('goals', fallbackArray) goals!: string[]
  @json('tags', fallbackArray) tags!: string[]

  @field('met') met!: number | null
  @field('is_unilateral') isUnilateral!: boolean
  @field('is_bodyweight') isBodyweight!: boolean

  @json('instructions_en', fallbackArray) instructionsEn!: string[]
  @json('instructions_de', fallbackArray) instructionsDe!: string[]
  @json('instructions_es', fallbackArray) instructionsEs!: string[]
  @json('tips_en', fallbackArray) tipsEn!: string[]
  @json('tips_de', fallbackArray) tipsDe!: string[]
  @json('tips_es', fallbackArray) tipsEs!: string[]

  @text('dataset_id') datasetId!: string | null
  @field('created_at') createdAt!: number
  @field('updated_at') updatedAt!: number
}