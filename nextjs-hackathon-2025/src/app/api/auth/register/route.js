import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { hashPassword } from "@/lib/credentials";

//THIS HANDLES LOGINS WITH EMAIL/PASSWORD NOT GOOGLE
export async function POST(request) {
  try {
    const { email, password, name, tier } = await request.json();

    // Check if user already exists
    const existingUser = await redis.get(`user:${email}`);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user object
    const user = {
      id: crypto.randomUUID(),
      email,
      name,
      password: hashedPassword,
      tier,
      image: null,
      emailVerified: new Date().toISOString(),
    };

    // Store user in Redis
    await redis.set(`user:${email}`, user);

    return NextResponse.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
