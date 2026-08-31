/**
 * Frontend Utility Functions for Teresita's Barbershop
 */

/**
 * Returns current year for dynamic copyright display
 */
export const getCurrentYear = () => new Date().getFullYear()

/**
 * Helper to capitalize string words
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Simple phone number formatter helper
 */
export const formatPhoneNumber = (value) => {
  if (!value) return value
  const phoneNumber = value.replace(/[^\d]/g, '')
  const phoneNumberLength = phoneNumber.length
  if (phoneNumberLength < 4) return phoneNumber
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
}
