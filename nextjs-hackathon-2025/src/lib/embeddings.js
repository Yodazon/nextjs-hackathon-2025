"use server";
import OpenAI from "openai";
import { Index } from "@upstash/vector";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create index with default namespace
const index = new Index({
  url: process.env.UPSTASH_VECTOR_URL,
  token: process.env.UPSTASH_VECTOR_TOKEN,
});

// Helper function to get user-specific index
function getUserIndex(userId) {
  return new Index({
    url: process.env.UPSTASH_VECTOR_URL,
    token: process.env.UPSTASH_VECTOR_TOKEN,
    namespace: `user_${userId}`, // Create separate namespace for each user
  });
}

// Chunking logic: split on sentence boundaries and maintain context
function generateChunks(input) {
  // Split on sentence boundaries but keep the context
  const sentences = input
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => sentence.trim().length > 0)
    .map((sentence) => sentence.trim());

  // Group sentences into chunks of 2-3 sentences to maintain context
  const chunks = [];
  for (let i = 0; i < sentences.length; i += 2) {
    const chunk = sentences.slice(i, i + 2).join(" ");
    if (chunk.trim().length > 0) {
      chunks.push(chunk);
    }
  }

  return chunks;
}

// Debug function to fetch specific vectors
export async function fetchVectors(vectorIds) {
  try {
    const response = await fetch(`${VECTOR_URL}/fetch/ns`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VECTOR_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: vectorIds,
        includeMetadata: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch vectors:", {
        status: response.status,
        error: errorText,
        vectorIds,
      });
      throw new Error(
        `Failed to fetch vectors: ${response.statusText} - ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchVectors:", error);
    throw error;
  }
}

export async function createEmbedding(text) {
  try {
    if (!text) {
      throw new Error("Input is empty or undefined");
    }

    if (typeof text !== "string") {
      throw new Error(`Input must be a string, got ${typeof text}`);
    }

    const trimmedText = text.trim();
    if (!trimmedText) {
      throw new Error("Input is empty after trimming");
    }

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: trimmedText,
      encoding_format: "float",
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error in createEmbedding:", {
      error: error.message,
      input: text,
      type: typeof text,
    });
    throw error;
  }
}

// Update storeConversation to use user-specific namespace
export async function storeConversation(userId, messages) {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const userIndex = getUserIndex(userId);
    const storedIds = [];

    for (const message of messages) {
      if (!message.content) continue;

      const chunks = generateChunks(message.content);

      for (const [chunkIndex, chunk] of chunks.entries()) {
        const messageId = `${crypto.randomUUID()}-${chunkIndex}`;
        const timestamp = Date.now();

        const embedding = await createEmbedding(chunk);

        // Store in user-specific namespace without userId in metadata
        await userIndex.upsert({
          id: messageId,
          vector: embedding,
          metadata: {
            role: String(message.role),
            content: String(chunk),
            originalMessage: String(message.content),
            timestamp: String(timestamp),
            chunkIndex: String(chunkIndex),
            totalChunks: String(chunks.length),
            botType: message.botType ? String(message.botType) : null,
            pipeName: message.pipeName ? String(message.pipeName) : null,
            userId: userId,
            //UPDATE ME
          },
        });

        storedIds.push(messageId);
      }
    }

    return storedIds;
  } catch (error) {
    console.error("Error in storeConversation:", error);
    throw error;
  }
}

// Update getConversationHistory to use user-specific namespace
export async function getConversationHistory(userId, limit = 50) {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const userIndex = getUserIndex(userId);
    const zeroVector = Array(1536).fill(0);

    // Query user's namespace directly
    const results = await userIndex.query({
      vector: zeroVector,
      topK: limit,
      includeMetadata: true,
    });
    console.log("below are the results of the first load");
    console.log(results);
    return results;
    // .filter((result) => result && result.metadata)
    // .map((result) => {
    //   const metadata = result.metadata;
    //   return {
    //     id: String(result.id || ""),
    //     role: String(metadata.role || "user"),
    //     content: String(metadata.originalMessage || ""),
    //     timestamp: parseInt(metadata.timestamp, 10),
    //     score: Number(result.score || 0),
    // botType: metadata.botType || null,
    // pipeName: metadata.pipeName || null,

    //   };
    // })
    // .filter((msg) => msg.content)
    // .sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error in getConversationHistory:", error);
    throw error;
  }
}

// Update findSimilarMessages to use user-specific namespace
export async function findSimilarMessages(userId, queryText, limit = 5) {
  try {
    if (!userId || !queryText) {
      throw new Error("userId and queryText are required");
    }

    const userIndex = getUserIndex(userId);
    const queryEmbedding = await createEmbedding(queryText);

    const results = await userIndex.query({
      vector: queryEmbedding,
      topK: limit * 2,
      includeMetadata: true,
    });

    // Rest of the grouping logic remains the same
    const groupedResults = results.reduce((acc, result) => {
      try {
        const metadata = result.metadata || {};
        const originalMessage = String(metadata.originalMessage || "");

        if (!originalMessage) {
          console.warn("Skipping result with missing originalMessage:", result);
          return acc;
        }

        if (!acc[originalMessage]) {
          acc[originalMessage] = {
            id: String(result.id || ""),
            role: String(metadata.role || ""),
            content: originalMessage,
            similarity: Number(result.score || 0),
            timestamp: Number(metadata.timestamp || 0),
            chunks: [],
          };
        }

        const chunkIndex = parseInt(String(metadata.chunkIndex || "0"), 10);
        const totalChunks = parseInt(String(metadata.totalChunks || "1"), 10);

        acc[originalMessage].chunks.push({
          content: String(metadata.content || ""),
          similarity: Number(result.score || 0),
          chunkIndex: chunkIndex,
          totalChunks: totalChunks,
        });
      } catch (error) {
        console.warn("Error processing result:", error, result);
      }
      return acc;
    }, {});

    // Sort chunks by similarity and return the most relevant messages
    return Object.values(groupedResults)
      .map((message) => ({
        ...message,
        chunks: message.chunks
          .sort((a, b) => a.chunkIndex - b.chunkIndex) // Sort chunks in original order
          .map((chunk) => ({
            content: chunk.content,
            similarity: chunk.similarity,
          })),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit); // Return only the requested number of messages
  } catch (error) {
    console.error("Error in findSimilarMessages:", error);
    throw error;
  }
}

function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function getRelevantContext(userId, queryText) {
  if (!userId || !queryText) {
    console.error("Missing userId or queryText");
    return [];
  }

  try {
    const similarMessages = await findSimilarMessages(userId, queryText);
    return similarMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  } catch (err) {
    console.error("Error getting relevant context:", err);
    return [];
  }
}
