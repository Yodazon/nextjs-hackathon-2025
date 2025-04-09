import { ElevenLabsClient } from "elevenlabs";
import { NextResponse } from "next/server";

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function POST(req) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "Missing message" }, { status: 400 });
  }

  try {
    const stream = await client.textToSpeech.convertAsStream(
      "ThT5KcBeYPX3keUQqHPh",
      {
        text: message,
        model_id: "eleven_flash_v2_5",
        output_format: "mp3_44100_128",
      }
    );

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 }
    );
  }
}
