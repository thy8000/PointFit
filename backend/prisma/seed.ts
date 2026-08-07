import { PrismaClient, MuscleGroup, EquipmentType } from '@prisma/client'
import type { DatasetExercise, ExerciseDataset } from '../src/modules/exercises/dataset.types'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

const BASE_IMAGE_URL =
  process.env.DATASET_IMAGE_BASE_URL ??
  'https://raw.githubusercontent.com/sergei-argutin/exercise-dataset/main/'

const muscleGroupMap: Record<string, MuscleGroup> = {
  chest: MuscleGroup.Chest,
  back: MuscleGroup.Back,
  upper_legs: MuscleGroup.Legs,
  lower_legs: MuscleGroup.Legs,
  shoulders: MuscleGroup.Shoulders,
  upper_arms: MuscleGroup.Arms,
  lower_arms: MuscleGroup.Arms,
  core: MuscleGroup.Core,
  full_body: MuscleGroup.FullBody,
}

const equipmentMap: Record<string, EquipmentType> = {
  barbell: EquipmentType.Barbell,
  ez_bar: EquipmentType.Barbell,
  trap_bar: EquipmentType.Barbell,
  dumbbell: EquipmentType.Dumbbell,
  kettlebell: EquipmentType.Kettlebell,
  cable: EquipmentType.Cable,
  resistance_band: EquipmentType.Band,
  loop_band: EquipmentType.Band,
  pull_up_bar: EquipmentType.Bodyweight,
  dip_station: EquipmentType.Bodyweight,
  rings: EquipmentType.Bodyweight,
  flat_bench: EquipmentType.Bodyweight,
  stability_ball: EquipmentType.Bodyweight,
  suspension_trainer: EquipmentType.Bodyweight,
  plyo_box: EquipmentType.Bodyweight,
  battle_rope: EquipmentType.Other,
  ab_wheel: EquipmentType.Other,
  air_bike: EquipmentType.Other,
  jump_rope: EquipmentType.Other,
  slam_ball: EquipmentType.Other,
  sled: EquipmentType.Other,
  plates: EquipmentType.Other,
  wrist_roller: EquipmentType.Other,
  climbing_rope: EquipmentType.Other,
  assisted_pullup_machine: EquipmentType.Machine,
  bicep_curl_machine: EquipmentType.Machine,
  chest_press_machine: EquipmentType.Machine,
  dip_machine: EquipmentType.Machine,
  glute_ham_developer: EquipmentType.Machine,
  hack_squat: EquipmentType.Machine,
  hip_abduction_machine: EquipmentType.Machine,
  hip_adduction_machine: EquipmentType.Machine,
  lat_pulldown_machine: EquipmentType.Machine,
  leg_curl: EquipmentType.Machine,
  leg_extension: EquipmentType.Machine,
  leg_press: EquipmentType.Machine,
  pec_deck: EquipmentType.Machine,
  preacher_curl_machine: EquipmentType.Machine,
  seated_calf_raise_machine: EquipmentType.Machine,
  shoulder_press_machine: EquipmentType.Machine,
  smith_machine: EquipmentType.Machine,
  standing_calf_raise_machine: EquipmentType.Machine,
}

const mapMuscleGroup = (bodyPart: string): MuscleGroup => {
  if (bodyPart === 'cardio') return MuscleGroup.Cardio
  return muscleGroupMap[bodyPart.toLowerCase()] ?? MuscleGroup.Other
}

const mapEquipment = (equipment: string | null | undefined): EquipmentType => {
  if (!equipment) return EquipmentType.Bodyweight
  return equipmentMap[equipment.toLowerCase()] ?? EquipmentType.Other
}

const toUrl = (uri: string) => `${BASE_IMAGE_URL}${uri.replace(/^\//, '')}`

const mapExercise = (exercise: DatasetExercise): ExerciseData => {

interface ExerciseData {
  name: string
  description: string | null
  muscleGroup: MuscleGroup
  equipment: EquipmentType
  thumbnailUrl: string | null
  imageStart: string | null
  imagePeak: string | null
  imageMain: string | null
  isCustom: boolean
  category: string | null
  forceType: string | null
  mechanic: string | null
  difficulty: string | null
  primaryMuscles: string[]
  secondaryMuscles: string[]
  goals: string[]
  tags: string[]
  met: number | null
  isUnilateral: boolean
  isBodyweight: boolean
  instructionsEn: string[]
  instructionsDe: string[]
  instructionsEs: string[]
  tipsEn: string[]
  tipsDe: string[]
  tipsEs: string[]
  datasetId: string
}

const mapExercise = (exercise: DatasetExercise): ExerciseData => {
  const flat = exercise.images.flat
  const start = 'start' in flat ? toUrl(flat.start) : null
  const peak = 'peak' in flat ? toUrl(flat.peak) : null
  const main = 'main' in flat ? toUrl(flat.main) : null

  return {
    name: exercise.name_en,
    description: exercise.description_en || exercise.instructions_en?.[0] || null,
    muscleGroup: mapMuscleGroup(exercise.body_part),
    equipment: mapEquipment(exercise.equipment),
    thumbnailUrl: start || peak || main,
    imageStart: start,
    imagePeak: peak,
    imageMain: main,
    isCustom: false,
    category: exercise.category || null,
    forceType: exercise.force_type || null,
    mechanic: exercise.mechanic || null,
    difficulty: exercise.difficulty || null,
    primaryMuscles: exercise.primary_muscles || [],
    secondaryMuscles: exercise.secondary_muscles || [],
    goals: exercise.goals || [],
    tags: exercise.tags || [],
    met: exercise.met ?? null,
    isUnilateral: exercise.is_unilateral ?? false,
    isBodyweight: exercise.is_bodyweight ?? false,
    instructionsEn: exercise.instructions_en || [],
    instructionsDe: exercise.instructions_de || [],
    instructionsEs: exercise.instructions_es || [],
    tipsEn: exercise.tips_en || [],
    tipsDe: exercise.tips_de || [],
    tipsEs: exercise.tips_es || [],
    datasetId: exercise.id,
  }
}

async function main() {
  console.log('🌱 Seeding database with exercise dataset...')

  const datasetPath = path.join(__dirname, '../src/modules/exercises/data/exercises.json')
  const datasetContent = fs.readFileSync(datasetPath, 'utf-8')
  const dataset: ExerciseDataset = JSON.parse(datasetContent)

  console.log(`📊 Encontrados ${dataset.count} exercícios no dataset`)

  let importedCount = 0
  let skippedCount = 0

  for (const exercise of dataset.exercises) {
    const data = mapExercise(exercise)

    try {
      await prisma.exerciseLibrary.upsert({
        where: { datasetId: data.datasetId },
        update: data,
        create: data,
      })
      importedCount++

      if (importedCount % 50 === 0) {
        console.log(`✅ Importados ${importedCount} exercícios...`)
      }
    } catch (error) {
      skippedCount++
      console.error(`❌ Erro ao importar ${exercise.name_en}:`, (error as Error).message)
    }
  }

  console.log(`✅ Seeding concluído! ${importedCount} exercícios importados.`)
  if (skippedCount > 0) {
    console.warn(`⚠️ ${skippedCount} exercícios falharam.`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })