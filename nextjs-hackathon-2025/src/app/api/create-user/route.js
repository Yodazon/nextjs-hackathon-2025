import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(req) {
  try {
    const { email, name, image, googleId } = await req.json();

    // Create or update user in Convex
    const user = await convex.mutation(api.users.createUser, {
      email,
      name,
      image,
      googleId,
      password: null, // Explicitly set password to null for Google auth
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
} 