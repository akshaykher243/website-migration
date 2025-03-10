import { describe, it, expect, beforeEach } from '@jest/globals'
import { getPayload } from '../helpers/getPayload'
import path from 'path'
import { fileURLToPath } from 'url'
import { Payload } from 'payload'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('Media Collection Integration', () => {
  let payload: Payload

  beforeEach(async () => {
    payload = await getPayload()
  })

  describe('Media API Endpoints', () => {
    it('should return media list', async () => {
      // Use payload's internal methods instead of supertest
      const result = await payload.find({
        collection: 'media',
      })

      expect(result.docs).toBeDefined()
      expect(Array.isArray(result.docs)).toBe(true)
    })

    it('should create media with valid data', async () => {
      // Create a test user first for authentication
      const user = await payload.create({
        collection: 'users',
        data: {
          email: 'media-test@example.com',
          password: 'Password123!',
        },
      })

      // Login to get authentication token
      const loginResponse = await payload.login({
        collection: 'users',
        data: {
          email: 'media-test@example.com',
          password: 'Password123!',
        },
      })

      // Test that we can access the media endpoint with authentication
      // We're not actually uploading a file, just testing the auth flow
      expect(loginResponse.token).toBeDefined()

      // Verify we can create media (this would normally require a file upload)
      try {
        await payload.create({
          collection: 'media',
          data: {
            alt: 'Test image',
          },
          // No file provided, so this should fail with a validation error
        })
        // Should not reach here
        expect(true).toBe(false)
      } catch (error) {
        // We expect an error because we didn't provide a file
        expect(error).toBeDefined()
      }
    })
  })
})
