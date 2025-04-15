const AiChat = async (message, messageHistory, pipeName, messageVariables) => {
  console.log("Current message:", message);
  console.log("Message history:", messageHistory);
  console.log("Using Pipe: ", pipeName);
  console.log("Variables being passed", messageVariables);

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
        variables: messageVariables,
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
