import { RiRobot2Line } from "react-icons/ri";
export function BotSwitchButton({ setShowBotSelector }) {
  return (
    <button
      className="p-2 bg-primary-main text-white rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
      onClick={() => setShowBotSelector(true)}
    >
      <RiRobot2Line /> Switch Bot
    </button>
  );
}
