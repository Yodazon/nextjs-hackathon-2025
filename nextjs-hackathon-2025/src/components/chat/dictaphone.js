//April 8, 2025

// The following code is used by the user for speech to text
// Uses WebSpeech API, not compatible with Mozilla
// Therefore more work is needed to be able to one

import React, { useState } from "react";
import { RiVoiceprintFill } from "react-icons/ri";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Dictaphone = ({ onTranscriptChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en-CA");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleSend = () => {
    if (transcript) {
      onTranscriptChange(transcript);
      resetTranscript();
    }
  };

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: false,
      language: selectedLanguage,
    });
  };

  const languages = [
    { code: "en-CA", name: "English (CA)" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "pl", name: "Polish" },
    { code: "sr-SP", name: "Serbian" },
  ];

  // if (!browserSupportsSpeechRecognition) {
  //   alert("Browser does not support speech recongition");
  // }

  return (
    <div className="bg-blue-200 p-4 rounded-lg  grid grid-cols-[auto_1fr_auto]">
      <div>
        <button
          onClick={listening ? SpeechRecognition.stopListening : startListening}
          className="bg-gray-400 p-2 rounded-xl block w-8"
        >
          <RiVoiceprintFill />
        </button>

        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className=" p-2 rounded"
        >
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.name}
            </option>
          ))}
        </select>
      </div>

      {transcript ? (
        <p className="mt-2 px-10">{transcript}</p>
      ) : (
        <p className="mt-2 px-10">Recorded text would appear here</p>
      )}

      <button
        className="bg-gray-400 p-2 rounded-xl block w-15"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};
export default Dictaphone;
