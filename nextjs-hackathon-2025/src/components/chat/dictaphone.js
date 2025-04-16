//April 8, 2025

// The following code is used by the user for speech to text
// Uses WebSpeech API, not compatible with Mozilla
// Therefore more work is needed to be able to one

import React, { useState, useEffect } from "react";
import { RiVoiceprintFill } from "react-icons/ri";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const Dictaphone = ({ onTranscriptChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en-CA");

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: false,
      language: selectedLanguage,
    });
  };

  useEffect(() => {
    console.log(transcript);
    if (transcript && !listening) {
      onTranscriptChange(transcript);
      resetTranscript();
    }
  }, [listening]);
  const handleSend = () => {
    startListening();
  };

  const languages = [
    { code: "en-CA", name: "English (CA)" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "pl", name: "Polish" },
  ];

  // if (!browserSupportsSpeechRecognition) {
  //   alert("Browser does not support speech recongition");
  // }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="bg-white p-4 rounded-lg  flex justify-between">
        <div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="p-2 rounded hover:cursor-pointer"
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
        </div>

        {transcript ? (
          <p className="mt-2 font-semibold text-center">{transcript}</p>
        ) : (
          <p className="mt-2 font-semibold text-center">
            Press the speech button to converse with the AI
          </p>
        )}

        <button
          className="bg-primary-main px-5 text-white rounded-lg block hover:cursor-pointer"
          onClick={handleSend}
        >
          <RiVoiceprintFill className="text-lg" />
        </button>
      </div>
    </div>
  );
};
export default Dictaphone;
