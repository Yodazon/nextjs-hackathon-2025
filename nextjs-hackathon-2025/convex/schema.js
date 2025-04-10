import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const userSchema = {
  email: v.string(),
  name: v.optional(v.string()),
  emailVerified: v.optional(v.number()),
  image: v.optional(v.union(v.string(), v.null())),
  password: v.optional(v.union(v.string(), v.null())),
  googleId: v.optional(v.string()),
};

export const sessionSchema = {
  userId: v.id("users"),
  expires: v.number(),
  sessionToken: v.string(),
};

export const accountSchema = {
  userId: v.id("users"),
  type: v.union(
    v.literal("email"),
    v.literal("oidc"),
    v.literal("oauth"),
    v.literal("webauthn"),
  ),
  provider: v.string(),
  providerAccountId: v.string(),
  refresh_token: v.optional(v.string()),
  access_token: v.optional(v.string()),
  expires_at: v.optional(v.number()),
  token_type: v.optional(v.string()),
  scope: v.optional(v.string()),
  id_token: v.optional(v.string()),
  session_state: v.optional(v.string()),
};

export const verificationTokenSchema = {
  identifier: v.string(),
  token: v.string(),
  expires: v.number(),
};

export default defineSchema({
  users: defineTable(userSchema).index("by_email", ["email"]),
  sessions: defineTable(sessionSchema)
    .index("by_sessionToken", ["sessionToken"])
    .index("by_userId", ["userId"]),
  accounts: defineTable(accountSchema)
    .index("by_providerAndAccountId", ["provider", "providerAccountId"])
    .index("by_userId", ["userId"]),
  verificationTokens: defineTable(verificationTokenSchema).index(
    "by_identifierToken",
    ["identifier", "token"],
  ),
  messages: defineTable({
    userId: v.string(),
    content: v.string(),
    role: v.string(),
    botType: v.string(),
    timestamp: v.number(),
  }).index("by_user_and_bot", ["userId", "botType"]),
});
