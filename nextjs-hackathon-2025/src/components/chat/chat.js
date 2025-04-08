//April 8, 2025

// The following code is used by the user for speech to text
// Uses WebSpeech API, not compatible with Mozilla
// Therefore more work is needed to be able to one
// This is handling the chat underneath with users and the chat with the screen

import React, { useState } from "react";
import { RiVoiceprintFill } from "react-icons/ri";
import Dictaphone from "./dictaphone";

const ChatScreen = () => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <div
        id="conversation-box"
        className="h-[60vh] w-2/3 border-black border-2 rounded-lg p-4 overflow-y-auto mx-auto "
      >
        This is where the conversation will appear
      </div>
      <div id="chat-box" className="w-2/3 mx-auto ">
        <Dictaphone />
      </div>
    </div>
  );
};
export default ChatScreen;
