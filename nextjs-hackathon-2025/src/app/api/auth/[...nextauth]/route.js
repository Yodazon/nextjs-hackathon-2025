import NextAuth from "next-auth";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import redis from "@/lib/redis";
import { providers } from "@/lib/providers";

const handler = NextAuth({
  providers,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google OAuth, ensure we have the user's email
      if (account?.provider === "google") {
        if (!user.email) {
          return false;
        }
        // Store or update user in Redis
        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          tier: "free",
          image: user.image,
          provider: "google",
        };
        await redis.set(`user:${user.email}`, userData);
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.provider = account?.provider || "credentials";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: UpstashRedisAdapter(redis),
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user, account }) {
      console.log("User signed in:", { user, account });
    },
    async signOut({ token }) {
      console.log("User signed out:", token);
    },
    async error({ error }) {
      console.error("Auth error:", error);
    },
  },
});

export { handler as GET, handler as POST };
