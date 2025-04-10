import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await fetch(process.env.NEXTAUTH_URL + "/api/auth/verify-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const user = await response.json();
          return {
            id: user._id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Error in credentials authorization:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Create or update user using the existing API route
          const response = await fetch(process.env.NEXTAUTH_URL + "/api/create-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              googleId: account.providerAccountId,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to create/update user:", errorData);
            throw new Error(errorData.error || "Failed to create/update user");
          }

          const createdUser = await response.json();
          user.id = createdUser._id;
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          throw error;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        if (account?.provider === "google") {
          token.googleId = account.providerAccountId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        if (token.googleId) {
          session.user.googleId = token.googleId;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 