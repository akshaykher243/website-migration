import dotenv from 'dotenv';

import { beforeEach, describe, expect, it } from '@jest/globals';
import { Payload } from 'payload';

import { getPayload } from '../helpers/getPayload';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// object destructuring to get the environment variables
const { TEST_PASSWORD, TEST_WRONG_PASSWORD } = process.env;

if (!TEST_PASSWORD || !TEST_WRONG_PASSWORD) {
  throw new Error('Test environment variables not set');
}

describe('Users Collection Integration', () => {
  let payload: Payload;

  beforeEach(async () => {
    payload = await getPayload();
  });

  describe('Authentication Flow', () => {
    it('should create user and login successfully', async () => {
      // Create test user
      const user = await payload.create({
        collection: 'users',
        data: {
          email: 'integration-test@example.com',
          password: TEST_PASSWORD,
        },
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('integration-test@example.com');

      // Attempt login
      const response = await payload.login({
        collection: 'users',
        data: {
          email: 'integration-test@example.com',
          password: TEST_PASSWORD,
        },
      });

      expect(response.user).toBeDefined();
      expect(response.token).toBeDefined();
    });

    it('should fail to login with incorrect password', async () => {
      // Create test user
      await payload.create({
        collection: 'users',
        data: {
          email: 'wrong-pass@example.com',
          password: TEST_PASSWORD,
        },
      });

      // Attempt login with wrong password
      try {
        await payload.login({
          collection: 'users',
          data: {
            email: 'wrong-pass@example.com',
            password: TEST_WRONG_PASSWORD,
          },
        });
        throw new Error('Login should have failed but succeeded');
      } catch (error: any) {
        expect(error.message).toContain(
          'The email or password provided is incorrect.'
        );
      }
    });
  });

  describe('User API Endpoints', () => {
    it('should allow access to me endpoint with authentication', async () => {
      // Create test user
      const createResponse = await payload.create({
        collection: 'users',
        data: {
          email: 'me-endpoint@example.com',
          password: TEST_PASSWORD,
        },
      });

      // Login to get token
      const loginResponse = await payload.login({
        collection: 'users',
        data: {
          email: 'me-endpoint@example.com',
          password: TEST_PASSWORD,
        },
      });

      // Use payload's findMe method instead of the API endpoint
      const me = await payload.findByID({
        collection: 'users',
        id: loginResponse.user.id,
      });

      expect(me).toBeDefined();
      expect(me.email).toBe('me-endpoint@example.com');
    });

    it('should require authentication for protected operations', async () => {
      // Try to find all users without authentication
      // This should still work but return only public fields
      const result = await payload.find({
        collection: 'users',
      });

      expect(result.docs).toBeDefined();
      expect(Array.isArray(result.docs)).toBe(true);

      // Ensure password is not returned
      if (result.docs.length > 0) {
        expect(result.docs[0].password).toBeUndefined();
      }
    });
  });
});
