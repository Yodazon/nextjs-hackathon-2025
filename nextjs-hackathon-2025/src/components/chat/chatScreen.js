"use client";

import React, { useState, useEffect } from "react";
import { RiVoiceprintFill, RiRobot2Line } from "react-icons/ri";
import Dictaphone from "./dictaphone";
import AiChat from "./aiConversation";
import AiVoice from "./aiAudio";
import { useSession } from "next-auth/react";
import { useRAGChat } from "@/lib/useRAGChat";
import { getConversationHistory, getRelevantContext } from "@/lib/embeddings";

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
