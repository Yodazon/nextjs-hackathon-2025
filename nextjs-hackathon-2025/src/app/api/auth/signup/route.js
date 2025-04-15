import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/credentials";
import redis from "@/lib/redis";
import { generateRandomString } from "@/lib/credentials";

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await redis.get(`user:${email}`);
    if (existingUser) {
      // If user exists with Google provider, prevent email/password signup
      if (existingUser.provider === 'google') {
        return NextResponse.json(
          { error: "This email is already associated with a Google account. Please sign in with Google." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user data
    const userData = {
      id: generateRandomString(16),
      email,
      name,
      password: hashedPassword,
      provider: 'credentials',
      createdAt: new Date().toISOString(),
    };

    // Store user in Redis
    await redis.set(`user:${email}`, userData);

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 