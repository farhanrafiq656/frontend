export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${isUser ? 'bg-[#7B5328] text-white rounded-br-sm' : 'bg-[#F5F0EB] text-[#1C1917] rounded-bl-sm'}`}>
        {message.content}
      </div>
    </div>
  );
}
