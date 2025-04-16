import { RiVoiceprintFill } from "react-icons/ri";
import React from "react";

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
  return (
    <div
      className={
        "max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none"
      }
    >
      <p className="whitespace-pre-wrap break-words">{content}</p>
    </div>
  );
}
