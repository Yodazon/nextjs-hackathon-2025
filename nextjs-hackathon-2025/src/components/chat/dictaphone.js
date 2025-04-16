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

  const {
    transcript,
    finalTranscript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: false,
      language: selectedLanguage,
    });
  };
  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  useEffect(() => {
    console.log(transcript);
    if (transcript && !listening) {
      onTranscriptChange(transcript);
      resetTranscript();
    }
    // stopListening();
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
      <div className="bg-white p-4 rounded-lg  grid grid-cols-[auto_1fr_auto]">
        <div>
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
          <p className="mt-2 px-10">
            Press the speech button to converse with the AI
          </p>
        )}

        <button
          className="bg-primary-main px-3 text-white rounded-lg block"
          onClick={handleSend}
        >
          <RiVoiceprintFill />
        </button>
      </div>
    </div>
  );
};
export default Dictaphone;
