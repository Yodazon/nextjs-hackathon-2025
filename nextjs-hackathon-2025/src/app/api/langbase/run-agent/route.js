import { Langbase } from "langbase";

const CONVERSATION_PIPE_API_KEY =
  process.env.LANGBASE_CONVERSATION_PIPE_API_KEY;
const TESTER_PIPE_API_KEY = process.env.LANGBASE_TESTER_AI_API_KEY;

export async function POST(req) {
  console.log("POST FUNCTION WORKING");
  try {
    //Get request body from the client
    const body = await req.json();
    const variables = body.variables;
    const messages = body.messages;
    const shouldStream = body.stream;
    const pipeName = body.pipeName || "base-conversational";

    if (
      !process.env.LANGBASE_API_KEY ||
      !CONVERSATION_PIPE_API_KEY ||
      !TESTER_PIPE_API_KEY
    ) {
      throw new Error("Missing API keys");
    }

    const langbase = new Langbase({
      apiKey: process.env.LANGBASE_API_KEY,
    });

    let API_KEY =
      pipeName === "base-conversational"
        ? CONVERSATION_PIPE_API_KEY
        : TESTER_PIPE_API_KEY;

    //STREAM
    if (shouldStream) {
      const { stream } = await langbase.pipes.run({
        stream: true,
        messages,
        variables,
        name: pipeName,
        apiKey: API_KEY,
      });
      return new Response(stream, { status: 200 });
    }
    //NOT STREAM
    console.log("running stream code");
    const { completion } = await langbase.pipes.run({
      stream: false,
      messages,
      variables,
      name: pipeName,
      apiKey: API_KEY,
    });

    return Response.json({ message: completion });
  } catch (error) {
    console.log("Uncaught API Error:", error);
    return Response(JSON.stringify(error), { status: 500 });
  }
}
