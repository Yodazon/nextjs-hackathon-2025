import { action, mutation } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

export const hashPassword = action({
  args: {
    password: v.string(),
  },
  handler: async (ctx, args) => {
    return await bcrypt.hash(args.password, 10);
  },
});

export const comparePassword = action({
  args: {
    password: v.string(),
    hash: v.string(),
  },
  handler: async (ctx, args) => {
    return await bcrypt.compare(args.password, args.hash);
  },
});

export const createUserWithPassword = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const { email, name, password } = args;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password using action
    const hashedPassword = await ctx.runAction(hashPassword, { password });

    // Create new user
    const userId = await ctx.db.insert("users", {
      email,
      name: name || email.split("@")[0],
      image: null,
      googleId: null,
      password: hashedPassword,
      createdAt: Date.now(),
    });

    return await ctx.db.get(userId);
  },
});
