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
  const [buttonColour, setButtonColour] = useState(
    "bg-primary-main text-white"
  );
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
      setButtonColour("bg-primary-main text-white");
      onTranscriptChange(transcript);
      resetTranscript();
    }
  }, [listening]);
  const handleSend = () => {
    setButtonColour("bg-white text-primary-main");
    startListening();
  };

  const languages = [
    {
      code: "en-CA",
      DesktopName: "English (CA)",
      MobileName: "🇨🇦 EN",
    },
    {
      code: "es-ES",
      DesktopName: "Spanish",
      MobileName: "🇪🇸 ES",
    },
    {
      code: "fr-FR",
      DesktopName: "French",
      MobileName: "🇫🇷 FR",
    },
    {
      code: "pl",
      DesktopName: "Polish",
      MobileName: "🇵🇱 PL",
    },
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="bg-white p-2 rounded-lg flex items-center gap-4">
        <div className="flex-shrink-0">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="p-2 rounded hover:cursor-pointer border "
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {isMobile ? language.MobileName : language.DesktopName}
              </option>
            ))}
          </select>
        </div>

        <div
          className={`flex-grow text-center ${isMobile ? "text-sm" : "text-xl"}`}
        >
          {transcript ? (
            <p className="font-semibold">{transcript}</p>
          ) : (
            <p className="font-semibold">
              Press the{" "}
              <RiVoiceprintFill className="inline border w-5 h-5 rounded-sm bg-primary-main text-white" />{" "}
              to converse with the AI
            </p>
          )}
        </div>

        <button
          className={`flex-shrink-0 w-12 h-12 flex items-center justify-center ${buttonColour} rounded-lg border-2 border-primary-main hover:cursor-pointer hover:text-primary-main hover:bg-white`}
          onClick={handleSend}
        >
          <RiVoiceprintFill className="text-lg" />
        </button>
      </div>
    </div>
  );
};
export default Dictaphone;
