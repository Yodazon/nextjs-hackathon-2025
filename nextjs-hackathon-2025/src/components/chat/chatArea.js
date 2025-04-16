export function ChatArea({ children }) {
  return (
    <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-sm p-4 mb-4">
      {children}
    </div>
  );
}

export function ChatHeader({ children }) {
  return (
    <div className="flex justify-between items-center mb-4">{children}</div>
  );
}
