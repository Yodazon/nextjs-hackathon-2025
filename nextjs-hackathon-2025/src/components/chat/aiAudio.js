import { ElevenLabs, ElevenLabsClient, play } from "elevenlabs";

const client = new ElevenLabsClient({
  apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
});
const AiVoice = async (message) => {
  try {
    const audioStream = await client.textToSpeech.convertAsStream(
      "ThT5KcBeYPX3keUQqHPh",
      {
        text: message,
        model_id: "eleven_flash_v2_5",
        output_format: "mp3_44100_128",
      }
    );

    // Collect all chunks
    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }

    // Combine chunks into a single Blob
    const audioBlob = new Blob(chunks, { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audioElement = new Audio(audioUrl);

    await audioElement.play();

    // Cleanup
    audioElement.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
  } catch (error) {
    console.error("Error playing audio:", error);
  }
};
export default AiVoice;
