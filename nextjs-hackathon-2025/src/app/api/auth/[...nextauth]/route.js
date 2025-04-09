import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorizing credentials:", credentials);
        
        // This is where you would typically validate the credentials against your database
        // For now, we'll use a simple hardcoded check
        if (credentials?.username === "test" && credentials?.password === "test") {
          console.log("Credentials valid, returning user");
          return {
            id: "1",
            name: "Test User",
            email: "test@example.com",
          };
        }
        console.log("Invalid credentials");
        return null;
      }
    })
  ],
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
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
});

export { handler as GET, handler as POST }; 