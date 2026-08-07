import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'exercises',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'muscle_group', type: 'string' },
        { name: 'equipment', type: 'string' },
        { name: 'thumbnail_url', type: 'string', isOptional: true },
        { name: 'image_start', type: 'string', isOptional: true },
        { name: 'image_peak', type: 'string', isOptional: true },
        { name: 'image_main', type: 'string', isOptional: true },
        { name: 'is_custom', type: 'boolean' },
        { name: 'category', type: 'string', isOptional: true },
        { name: 'difficulty', type: 'string', isOptional: true },
        { name: 'primary_muscles', type: 'string', isOptional: true },
        { name: 'secondary_muscles', type: 'string', isOptional: true },
        { name: 'goals', type: 'string', isOptional: true },
        { name: 'tags', type: 'string', isOptional: true },
        { name: 'met', type: 'number', isOptional: true },
        { name: 'is_unilateral', type: 'boolean' },
        { name: 'is_bodyweight', type: 'boolean' },
        { name: 'instructions_en', type: 'string', isOptional: true },
        { name: 'instructions_de', type: 'string', isOptional: true },
        { name: 'instructions_es', type: 'string', isOptional: true },
        { name: 'tips_en', type: 'string', isOptional: true },
        { name: 'tips_de', type: 'string', isOptional: true },
        { name: 'tips_es', type: 'string', isOptional: true },
        { name: 'dataset_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
})