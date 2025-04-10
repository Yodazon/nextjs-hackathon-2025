import NextAuth from "next-auth";
import { UpstashRedisAdapter } from '@auth/upstash-redis-adapter';
import redis from '@/lib/redis';
import providers from '@/lib/providers';

const handler = NextAuth({
  providers,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback:", { token, user });
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback:", { session, token });
      if (token) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: UpstashRedisAdapter(redis),
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
});

export { handler as GET, handler as POST }; 