import { describe, it, expect } from '@jest/globals'
import { Users } from '../Users'

describe('Users Collection Unit', () => {
  describe('Users Collection Configuration', () => {
    it('should have the correct slug', () => {
      expect(Users.slug).toBe('users')
    })

    it('should have auth enabled', () => {
      expect(Users.auth).toBe(true)
    })

    it('should use email as title in admin UI', () => {
      expect(Users.admin?.useAsTitle).toBe('email')
    })
  })
})
