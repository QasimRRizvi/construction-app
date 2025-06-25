import {
  createRxDatabase,
  type RxDatabase,
  type RxCollection
} from 'rxdb'

import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'

import userSchema, { type User } from './schemas/user.schema'
import taskSchema, { type Task } from './schemas/task.schema'
import checklistSchema, { type Checklist } from './schemas/checklist.schema'

export interface AppDatabaseCollections {
  users: RxCollection<User>
  tasks: RxCollection<Task>
  checklists: RxCollection<Checklist>
}

export type AppDatabase = RxDatabase<AppDatabaseCollections>

let db: AppDatabase | null = null

export async function getDB(): Promise<AppDatabase> {
  if (db) return db

  db = await createRxDatabase<AppDatabaseCollections>({
    name: 'construction',
    storage: getRxStorageDexie(),
  })

  await db.addCollections({
    users: { schema: userSchema },
    tasks: { schema: taskSchema },
    checklists: { schema: checklistSchema }
  })

  return db
}
