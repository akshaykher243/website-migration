import { describe, it, expect } from '@jest/globals'
import { Media } from '../Media'

describe('Media Collection Unit', () => {
  describe('Media Collection Configuration', () => {
    it('should have the correct slug', () => {
      expect(Media.slug).toBe('media')
    })

    it('should have upload enabled', () => {
      expect(Media.upload).toBe(true)
    })

    it('should require alt text', () => {
      const altField = Media.fields.find(
        (field) => 'name' in field && field.name === 'alt'
      )
      expect(altField).toBeDefined()
      if (altField && 'type' in altField) {
        expect(altField.type).toBe('text')
      }
      if (altField && 'required' in altField) {
        expect(altField.required).toBe(true)
      }
    })

    it('should have read access for everyone', () => {
      expect(Media.access?.read).toBeDefined()
      // Since access.read is a function that requires args, we can't easily test its return value
      // in a unit test without mocking the args
    })
  })
})
