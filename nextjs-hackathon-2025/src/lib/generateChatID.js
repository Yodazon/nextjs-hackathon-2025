export function generateChatId() {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
