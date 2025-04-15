"use client";

import React from "react";
import MainLayout from "../layout/MainLayout";
import BaseChatScreen from "./mainChatComponent";

const bots = {
  conversational: {
    name: "Chat Bot",
    pipeName: "base-conversational",
    icon: "💬",
    voice: "ThT5KcBeYPX3keUQqHPh",
    id: "conversational",
  },
  quiz: {
    name: "Quiz Master",
    pipeName: "tester-ai",
    icon: "❓",
    voice: "ThT5KcBeYPX3keUQqHPh",
    id: "quiz",
  },
};

const ChatScreen = () => {
  return (
    <MainLayout>
      <BaseChatScreen
        initialBot="conversational"
        allowBotSwitch={true}
        bots={bots}
      />
    </MainLayout>
  );
};

export default ChatScreen;
