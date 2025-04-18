export default function BotSelector({
  showBotSelector,
  setShowBotSelector,
  bots,
  currentBot,
  setCurrentBot,
}) {
  // Handle background clicks to close the modal
  const handleBackgroundClick = (e) => {
    // Only close if the click was directly on the background element
    // and not on any of its children
    if (e.target === e.currentTarget) {
      setShowBotSelector(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/25 flex items-center justify-center ${
        showBotSelector ? "block" : "hidden"
      }`}
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Select AI Bot</h2>
        <div className="flex flex-col gap-3">
          {Object.entries(bots).map(([botId, bot]) => (
            <button
              key={botId}
              className={`p-3 rounded-lg flex items-center gap-2 transition-colors ${
                currentBot === botId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => {
                setCurrentBot(botId);
                setShowBotSelector(false);
              }}
            >
              <span>{bot.icon}</span>
              {bot.name}
            </button>
          ))}
        </div>
        <button
          className="mt-4 p-2 bg-gray-200 rounded-lg w-full hover:bg-gray-300 transition-colors"
          onClick={() => setShowBotSelector(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
