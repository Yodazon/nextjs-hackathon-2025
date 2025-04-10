export function generateRandomToken() {
  const array = new Uint8Array(20)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function generateRandomString(inputValue) {
  const encoder = new TextEncoder()
  const data = encoder.encode(inputValue)
  return crypto.subtle.digest('SHA-256', data).then((hashBuffer) => {
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
  })
}

export async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function comparePassword(password, hash) {
  const hashedPassword = await hashPassword(password)
  return hashedPassword === hash
} 