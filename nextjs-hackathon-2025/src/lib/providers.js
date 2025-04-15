import { nanoid } from 'nanoid'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { comparePassword, hashPassword } from './credentials'
import redis from './redis'

export const providers = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Missing credentials");
      }

      // Check if user exists in Redis
      const userData = await redis.get(`user:${credentials.email}`);
      
      if (!userData) {
        throw new Error("No user found with this email");
      }

      // Check if user was created with Google
      if (userData.provider === 'google') {
        throw new Error("This email is associated with a Google account. Please sign in with Google.");
      }

      // Verify password
      const isValid = await comparePassword(credentials.password, userData.password);
      if (!isValid) {
        throw new Error("Invalid password");
      }

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        image: userData.image,
        provider: 'credentials'
      };
    }
  })
] 