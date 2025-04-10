import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { comparePassword } from "./auth";

export const getUserByGoogleId = query({
  args: { googleId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_googleId", (q) => q.eq("googleId", args.googleId))
      .first();
  },
});

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    googleId: v.optional(v.string()),
    password: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const { email, name, image, googleId, password } = args;

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingUser) {
      // If user exists with Google auth, update their password
      if (existingUser.googleId && googleId) {
        throw new Error("User already exists with Google account");
      }
      if (existingUser.password && password) {
        throw new Error("User already exists with email/password");
      }
      
      // Update existing user with new Google ID if they don't have one
      if (googleId && !existingUser.googleId) {
        await ctx.db.patch(existingUser._id, {
          googleId,
          image: image || existingUser.image,
          name: name || existingUser.name,
        });
        return await ctx.db.get(existingUser._id);
      }
    }

    // Create user data object
    const userData = {
      email,
      name: name || email.split("@")[0],
      image,
      googleId,
      emailVerified: Date.now(),
    };

    // Only add password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userData.password = hashedPassword;
    } else {
      userData.password = null;
    }

    // Create new user
    const userId = await ctx.db.insert("users", userData);
    return await ctx.db.get(userId);
  },
});

export const verifyPassword = query({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user || !user.password) {
      return false;
    }

    return await comparePassword({ password: args.password, hash: user.password });
  },
});
