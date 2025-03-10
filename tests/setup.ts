import { beforeAll, afterAll, afterEach, jest } from '@jest/globals'
import payload from 'payload'
import { getPayload } from './helpers/getPayload'
import { Payload } from 'payload'

// Increase timeout for all tests
jest.setTimeout(60000) // Increase timeout to 60 seconds

let payloadInstance: Payload | undefined

beforeAll(async () => {
  // Initialize Payload once for all tests
  payloadInstance = await getPayload()
})

afterEach(async () => {
  try {
    // Clean up database after each test by deleting all documents
    // but keeping the tables/schema intact
    const collections = Object.values(payload.collections)
    for (const collection of collections) {
      try {
        await payload.delete({
          collection: collection.config.slug,
          where: {},
        })
      } catch (error) {
        console.log(
          `Error cleaning up collection ${collection.config.slug}:`,
          error
        )
      }
    }
  } catch (error) {
    console.log('Error in afterEach cleanup:', error)
  }
})

// Add proper cleanup after all tests
afterAll(async () => {
  try {
    // Close the Payload instance to prevent hanging connections
    if (payloadInstance) {
      // Use the global payload instance which is guaranteed to be initialized
      await payload.db?.destroy?.()
      console.log('Payload database connection closed')
    }
  } catch (error) {
    console.log('Error in afterAll cleanup:', error)
  }
})

// No need to destroy the database connection after all tests
// as the Docker container will be stopped by the test script
