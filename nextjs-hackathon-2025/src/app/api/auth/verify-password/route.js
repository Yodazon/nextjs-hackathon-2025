import { NextResponse } from "next/server";
import { api } from "../../../../../convex/_generated/api"
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const response = await fetch(process.env.NEXT_PUBLIC_CONVEX_URL + "/api/verifyPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = await response.json();
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in verify-password route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 