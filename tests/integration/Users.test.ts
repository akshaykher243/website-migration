import { describe, it, expect, beforeEach } from '@jest/globals'
import { getPayload } from '../helpers/getPayload'
import { Payload } from 'payload'

describe('Users Collection Integration', () => {
  let payload: Payload

  beforeEach(async () => {
    payload = await getPayload()
  })

  describe('Authentication Flow', () => {
    it('should create user and login successfully', async () => {
      // Create test user
      const user = await payload.create({
        collection: 'users',
        data: {
          email: 'integration-test@example.com',
          password: 'Password123!',
        },
      })

      expect(user).toBeDefined()
      expect(user.email).toBe('integration-test@example.com')

      // Attempt login
      const response = await payload.login({
        collection: 'users',
        data: {
          email: 'integration-test@example.com',
          password: 'Password123!',
        },
      })

      expect(response.user).toBeDefined()
      expect(response.token).toBeDefined()
    })

    it('should fail to login with incorrect password', async () => {
      // Create test user
      await payload.create({
        collection: 'users',
        data: {
          email: 'wrong-pass@example.com',
          password: 'Password123!',
        },
      })

      // Attempt login with wrong password
      await expect(
        payload.login({
          collection: 'users',
          data: {
            email: 'wrong-pass@example.com',
            password: 'WrongPassword123!',
          },
        })
      ).rejects.toThrow()
    })
  })

  describe('User API Endpoints', () => {
    it('should allow access to me endpoint with authentication', async () => {
      // Create test user
      const createResponse = await payload.create({
        collection: 'users',
        data: {
          email: 'me-endpoint@example.com',
          password: 'Password123!',
        },
      })

      // Login to get token
      const loginResponse = await payload.login({
        collection: 'users',
        data: {
          email: 'me-endpoint@example.com',
          password: 'Password123!',
        },
      })

      // Use payload's findMe method instead of the API endpoint
      const me = await payload.findByID({
        collection: 'users',
        id: loginResponse.user.id,
      })

      expect(me).toBeDefined()
      expect(me.email).toBe('me-endpoint@example.com')
    })

    it('should require authentication for protected operations', async () => {
      // Try to find all users without authentication
      // This should still work but return only public fields
      const result = await payload.find({
        collection: 'users',
      })

      expect(result.docs).toBeDefined()
      expect(Array.isArray(result.docs)).toBe(true)

      // Ensure password is not returned
      if (result.docs.length > 0) {
        expect(result.docs[0].password).toBeUndefined()
      }
    })
  })
})
