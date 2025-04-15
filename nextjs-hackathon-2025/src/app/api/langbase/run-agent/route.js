import { Langbase } from "langbase";

const CONVERSATION_PIPE_API_KEY =
  process.env.LANGBASE_CONVERSATION_PIPE_API_KEY;
const TESTER_PIPE_API_KEY = process.env.LANGBASE_TESTER_AI_API_KEY;
const LANGBASE_LESSONS_AI_API_KEY = process.env.LANGBASE_LESSONS_AI_API_KEY;

export async function POST(req) {
  try {
    //Get request body from the client
    const body = await req.json();
    const messages = body.messages;
    const shouldStream = body.stream;
    const pipeName = body.pipeName || "base-conversational";

    // Transform variables into two separate name-value pairs
    const rawVariables = body.variables;
    const variables = rawVariables?.[0]?.variable
      ? [
          {
            name: "subject",
            value: rawVariables[0].variable.subject || "",
          },
          {
            name: "difficulty",
            value: rawVariables[0].variable.difficulty || "1",
          },
        ]
      : [];

    console.log("this is a variables taken out");
    console.log(variables);

    if (
      !process.env.LANGBASE_API_KEY ||
      !CONVERSATION_PIPE_API_KEY ||
      !TESTER_PIPE_API_KEY ||
      !LANGBASE_LESSONS_AI_API_KEY
    ) {
      return Response.json({ error: "Missing API keys" }, { status: 500 });
    }

    const langbase = new Langbase({
      apiKey: process.env.LANGBASE_API_KEY,
    });

    const API_KEY =
      pipeName === "base-conversational"
        ? CONVERSATION_PIPE_API_KEY
        : pipeName === "tester-ai"
          ? TESTER_PIPE_API_KEY
          : pipeName === "lesson-teacher"
            ? LANGBASE_LESSONS_AI_API_KEY
            : CONVERSATION_PIPE_API_KEY; // default fallback

    if (shouldStream) {
      try {
        const { stream } = await langbase.pipes.run({
          stream: true,
          messages,
          variables,
          name: pipeName,
          apiKey: API_KEY,
        });
        return new Response(stream, {
          headers: { "Content-Type": "text/event-stream" },
        });
      } catch (error) {
        console.error("Stream Error:", error);
        return Response.json(
          { error: error.message || "Stream error occurred" },
          { status: 500 }
        );
      }
    }

    const { completion } = await langbase.pipes.run({
      stream: false,
      messages,
      variables,
      name: pipeName,
      apiKey: API_KEY,
    });

    return Response.json({ message: completion });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
