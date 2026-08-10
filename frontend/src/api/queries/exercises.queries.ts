import { gql } from '@apollo/client'

export const EXERCISES_QUERY = gql`
  query Exercises(
    $muscleGroup: MuscleGroup
    $equipment: EquipmentType
    $search: String
    $difficulty: String
    $category: String
    $limit: Int
    $offset: Int
  ) {
    exercises(
      muscleGroup: $muscleGroup
      equipment: $equipment
      search: $search
      difficulty: $difficulty
      category: $category
      limit: $limit
      offset: $offset
    ) {
      id
      name
      description
      muscleGroup
      equipment
      thumbnailUrl
      imageStart
      imagePeak
      imageMain
      isCustom
      category
      difficulty
      primaryMuscles
      secondaryMuscles
      goals
      tags
      met
      isUnilateral
      isBodyweight
    }
  }
`

export const EXERCISE_QUERY = gql`
  query Exercise($id: ID!) {
    exercise(id: $id) {
      id
      name
      description
      muscleGroup
      equipment
      thumbnailUrl
      imageStart
      imagePeak
      imageMain
      difficulty
      primaryMuscles
      secondaryMuscles
      goals
      tags
      instructionsEn
      instructionsDe
      instructionsEs
      tipsEn
      tipsDe
      tipsEs
    }
  }
`