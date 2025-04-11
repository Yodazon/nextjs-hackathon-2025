import { nanoid } from 'nanoid'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { comparePassword, hashPassword } from './credentials'
import redis from './redis'

export default [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      try {
        const user = await redis.get(`user:${credentials.email}`)
        
        if (!user) {
          return null
        }

        const isValid = await comparePassword(credentials.password, user.password)
        
        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      } catch (error) {
        console.error('Error in credentials authorization:', error)
        return null
      }
    }
  })
] 