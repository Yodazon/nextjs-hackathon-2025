"use client";

import React, { useState } from "react";
import Dictaphone from "./dictaphone";
import BotSelector from "./botSelector";
import ToggleSwitch from "./ToggleSwitch";
import { useSession } from "next-auth/react";
import { ChatMessage } from "./chatMessage";
import { ChatArea, ChatHeader } from "./chatArea";
import { BotDisplay } from "./botDisplay";
import { BotSwitchButton } from "./botSwitchButton";
import { useAiChat } from "./hooks/useAiChat";

const BaseChatScreen = ({
  initialBot,
  allowBotSwitch = true,
  bots,
  systemContext = [],
  systemVariable = [],
  className = "h-[calc(100vh-8rem)]",
}) => {
  const [currentBot, setCurrentBot] = useState(initialBot);
  const [showBotSelector, setShowBotSelector] = useState(false);
  const [shouldPlayAudio, setShouldPlayAudio] = useState(false);

  const { data: session } = useSession();
  const { conversations, sendMessage } = useAiChat();

  const handleBotChange = (bot) => {
    setCurrentBot(bot);
  };
  const handleTranscriptChange = async (newTranscript) => {
    if (!session?.user) {
      alert("Please sign in to continue");
      return;
    }

    try {
      await sendMessage(
        newTranscript,
        bots[currentBot],
        systemContext,
        systemVariable,
        shouldPlayAudio,
      );
    } catch (error) {
      console.error("Error in transcript handling:", error);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Bot Selector Header */}
      <ChatHeader>
        <div className="flex items-center space-x-4">
          <BotDisplay currentBot={bots[currentBot]} />
          <ToggleSwitch
            initialState={shouldPlayAudio}
            onChange={setShouldPlayAudio}
            label="Auto-speak"
          />
        </div>
        {allowBotSwitch && (
          <BotSwitchButton setShowBotSelector={setShowBotSelector} />
        )}
      </ChatHeader>

      {/* Chat Messages */}
      <ChatArea>
        {conversations.map((msg, index) => (
          <ChatMessage
            key={index}
            messageType={msg.type}
            content={msg.content}
          />
        ))}
      </ChatArea>
      {/* Input Area */}
      <Dictaphone onTranscriptChange={handleTranscriptChange} />
      {/* Bot Selector Modal */}
      {allowBotSwitch && (
        <BotSelector
          showBotSelector={showBotSelector}
          setShowBotSelector={setShowBotSelector}
          currentBot={currentBot}
          setCurrentBot={handleBotChange}
          bots={bots}
        />
      )}
    </div>
  );
};

export default BaseChatScreen;
