import React, { useState } from "react";
import { getRunner } from "langbase";

const AiChat = async (message) => {
  console.log(message);
  try {
    const response = await fetch("/api/langbase/run-agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stream: false,
        messages: [{ role: "user", content: message }],
        // variables: [{ name: "user", value: message }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.error || "Request failed");
    }

    const data = await response.json();

    return data.message;
  } catch (error) {
    console.error("Error generating completion:", error);
    return "sorry there was an error processing the request";
  }
};

export default AiChat;
