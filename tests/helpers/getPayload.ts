import { Payload } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import payload from 'payload'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { Users } from '../../src/collections/Users'
import { Media } from '../../src/collections/Media'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load test environment variables
dotenv.config({ path: '.env.test' })

let initialized = false

export const getPayload = async (): Promise<Payload> => {
  if (!initialized) {
    try {
      const config = buildConfig({
        secret: process.env.PAYLOAD_SECRET || 'test-secret',
        typescript: {
          outputFile: path.resolve(__dirname, '../../src/payload-types.ts'),
        },
        collections: [Users, Media],
        editor: lexicalEditor(),
        db: postgresAdapter({
          pool: {
            host: process.env.POSTGRES_HOST || 'localhost',
            port: Number(process.env.POSTGRES_PORT) || 5434,
            database: process.env.POSTGRES_DB || 'payload_test',
            user: process.env.POSTGRES_USER || 'payload',
            password: process.env.POSTGRES_PASSWORD || 'payload',
          },
          // Use a custom migration directory for tests
          migrationDir: path.resolve(__dirname, '../../migrations'),
        }),
      })

      await payload.init({
        config,
      })

      initialized = true
    } catch (error) {
      console.error('Error initializing Payload:', error)
      throw error
    }
  }

  return payload
}
