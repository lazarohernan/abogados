'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

interface ChatSectionProps {
  profile: UserProfile;
  messages: Message[];
  isTyping: boolean;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
}

const MESSAGE_LIMIT_TRIAL = 10; // Message limit for trial users

export default function ChatSection({
  profile,
  messages,
  isTyping,
  inputMessage,
  setInputMessage,
  handleSendMessage,
}: ChatSectionProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Calculate remaining messages for trial users
  const isTrialUser = profile.subscription_status === 'trial';
  const remainingMessages = isTrialUser ? MESSAGE_LIMIT_TRIAL - messages.length : null;
  const hasReachedLimit = isTrialUser && remainingMessages !== null && remainingMessages <= 0;

  // Calculate trial status
  const trialEnd = profile.trial_end ? new Date(profile.trial_end) : null;
  const now = new Date();
  const isTrialActive = trialEnd ? trialEnd > now : false;
  const daysLeftInTrial = trialEnd 
    ? Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
      setIsAtBottom(isBottom);
      setShowScrollButton(!isBottom);
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (isAtBottom && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAtBottom]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasReachedLimit) {
      return;
    }
    handleSendMessage();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Trial/Subscription Warning */}
      {(isTrialUser || profile.subscription_status === 'inactive') && (
        <div className="bg-yellow-50 p-4 border-b border-yellow-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  {profile.subscription_status === 'inactive'
                    ? 'Tu suscripción ha expirado'
                    : isTrialActive
                    ? `Periodo de prueba: ${remainingMessages} mensajes restantes (${daysLeftInTrial} días)`
                    : 'Tu periodo de prueba ha terminado'}
                </h3>
              </div>
            </div>
            <Link
              href="/dashboard/subscription"
              className="ml-4 px-4 py-2 text-sm font-medium text-yellow-800 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors"
            >
              Actualizar a premium
            </Link>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.created_at && (
                <span className={`text-xs mt-1 block ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
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

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}

      {/* Input Form */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              hasReachedLimit
                ? "Has alcanzado el límite de mensajes. Actualiza a premium para continuar."
                : "Escribe tu mensaje..."
            }
            disabled={hasReachedLimit || !isTrialActive}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping || hasReachedLimit || !isTrialActive}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTyping ? (
              <div className="flex items-center space-x-2">
                <span>Enviando</span>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
              </div>
            ) : (
              'Enviar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}