export function BotDisplay({ currentBot }) {
  return (
    <h2 className="text-lg font-semibold flex items-center">
      <span className="mr-2">{currentBot.icon}</span>
      {currentBot.name}
    </h2>
  );
}
