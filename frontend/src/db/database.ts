import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import { mySchema } from './schema'
import { UserModel, ExerciseModel } from '../models'

// LokiJSAdapter (JS-only): funciona em Expo Go, web e simula offline-first
// nesta fase. Em fases futuras, trocar pelo SQLiteAdapter (requer build nativo).
const adapter = new LokiJSAdapter({
  dbName: 'pointfit',
  schema: mySchema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
})

export const database = new Database({
  adapter,
  modelClasses: [UserModel, ExerciseModel],
})