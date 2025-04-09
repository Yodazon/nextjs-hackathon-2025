import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// This file can be removed if it's empty, or you can add other tasks here

export const getMessageHistory = query({
  args: {
    userId: v.string(),
    botType: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .filter(
        (q) =>
          q.eq(q.field("userId"), args.userId) &&
          q.eq(q.field("botType"), args.botType)
      )
      .order("desc")
      .take(50);

    return messages.reverse();
  },
});
