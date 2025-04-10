import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    userId: v.string(),
    content: v.string(),
    role: v.string(),
    botType: v.string(),
    timestamp: v.number(),
  }).index("by_user_and_bot", ["userId", "botType"]),

  users: defineTable({
    email: v.string(),
    name: v.string(),
    image: v.union(v.string(), v.null()),
    googleId: v.union(v.string(), v.null()),
    password: v.union(v.string(), v.null()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
