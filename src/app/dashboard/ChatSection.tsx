// ChatSection.tsx
'use client';

import { useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant'; // Ensure 'role' is consistently defined throughout the system.
  content: string;
  created_at?: string;
}

interface UserProfile {
  full_name: string;
  email: string;
  subscription_status: 'trial' | 'active' | 'inactive'; // Added to ensure profile aligns with other components
  trial_end?: string | null; // Added to ensure profile aligns with other components
}

interface ChatSectionProps {
  profile: UserProfile;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>; // Updated to align with React's state handling
  isTyping: boolean;
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>; // Updated to align with React's state handling
  handleSendMessage: () => void;
}

export default function ChatSection({
  profile,
  messages,
  setMessages,
  isTyping,
  inputMessage,
  setInputMessage,
  handleSendMessage,
}: ChatSectionProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white order-1'
                  : 'bg-gray-100 text-gray-900 order-2'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              {message.created_at && (
                <div className="text-xs opacity-70 mt-1">
                  {new Date(message.created_at).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center mb-2">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Entrada de chat */}
      <div className="border-t p-4 sticky bottom-0 bg-white">
        <div className="flex space-x-4">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Escribe tu consulta legal aquí..."
            className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-32"
            rows={1}
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTyping ? 'Procesando' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
}
