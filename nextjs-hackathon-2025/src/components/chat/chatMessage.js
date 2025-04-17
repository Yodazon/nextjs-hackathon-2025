import { RxSpeakerLoud } from "react-icons/rx";

import React, { useEffect, useState } from "react";
import AiVoice from "./aiAudio";

export function ChatMessage({ messageType, content }) {
  const isUser = messageType == "user";

  const Message = isUser ? UserMessage : AiMessage;

  return (
    <div className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <Message content={content} />
    </div>
  );
}

function UserMessage({ content }) {
  return (
    <div
      className={
        "max-w-[80%] p-3 rounded-lg bg-primary-main text-white rounded-br-none"
      }
    >
      <p className="whitespace-pre-wrap break-words">{content}</p>
    </div>
  );
}

function AiMessage({ content }) {
  const [isPlaying, setIsPlaying] = useState("bg-primary-main text-white");

  const handleAudioSubmit = async (text) => {
    try {
      setIsPlaying("bg-white text-primary-main");
      await AiVoice(text);
    } catch (error) {
      console.error("Error Playing Audio");
    } finally {
      setIsPlaying("bg-primary-main text-white");
    }
  };

  return (
    <div
      className={
        "max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none"
      }
    >
      <p className="whitespace-pre-wrap break-words">{content}</p>
      <div className="flex justify-end">
        <button
          className="mt-2 p-1   transition-colors"
          onClick={() => handleAudioSubmit(content)}
        >
          <RxSpeakerLoud
            className={`${isPlaying} text-black rounded-md border-2 black p-1  w-15 h-8`}
          />
        </button>
      </div>
    </div>
  );
}
