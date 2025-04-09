import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getMessageHistory = query({
  args: {
    userId: v.string(),
    botType: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_user_and_bot", (q) =>
        q.eq("userId", args.userId).eq("botType", args.botType)
      )
      .order("asc")
      .collect();

    return messages;
  },
});

export const storeMessage = mutation({
  args: {
    userId: v.string(),
    content: v.string(),
    role: v.string(),
    botType: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      ...args,
      timestamp: Date.now(),
    });
  },
}); 