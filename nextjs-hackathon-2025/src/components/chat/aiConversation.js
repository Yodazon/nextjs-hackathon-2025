const AiChat = async (message, messageHistory, pipeName) => {
  console.log("Current message:", message);
  console.log("Message history:", messageHistory);
  console.log("Using Pipe: ", pipeName);

  try {
    const response = await fetch("/api/langbase/run-agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stream: false,
        messages: messageHistory,
        pipeName: pipeName,
        // variables: [{ name: "user", value: message }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.error || "Request failed");
    }

    return data.message;
  } catch (error) {
    console.error("Error generating completion:", error);
    return "sorry there was an error processing the request";
  }
};

export default AiChat;
