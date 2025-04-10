"use client";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { SessionProvider, useSession } from "next-auth/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

function useAuth() {
  const { data: session, update } = useSession();
  return {
    isLoading: false,
    isAuthenticated: session !== null,
    fetchAccessToken: async ({ forceRefreshToken }) => {
      if (forceRefreshToken) {
        const session = await update();
        return session?.convexToken ?? null;
      }
      return session?.convexToken ?? null;
    },
  };
}

export function Providers({ children }) {
  return (
    <SessionProvider>
      <ConvexProviderWithAuth client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithAuth>
    </SessionProvider>
  );
}
