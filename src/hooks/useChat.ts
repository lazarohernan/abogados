'use client';

import { useRef, useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useRouter } from 'next/navigation';

interface ChatSectionProps {
  profile: UserProfile;
  subscriptionStatus: string;
  conversationId: string;
}

export default function ChatSection({
  profile,
  subscriptionStatus,
  conversationId
}: ChatSectionProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [inputMessage, setInputMessage] = useState('');
  
  const { messages, sendMessage, isTyping, currentMessage } = useChat(conversationId);

  // Auto-scroll al último mensaje
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentMessage]);

  // Verificar suscripción
  if (subscriptionStatus === 'inactive') {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-xl font-semibold mb-4">
            Tu período de prueba ha terminado
          </div>
          <p className="text-gray-600 mb-6">
            Para continuar usando LegalIA, por favor actualiza tu suscripción.
          </p>
          <button
            onClick={() => router.push('/pricing')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ver planes de suscripción
          </button>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isTyping) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar del asistente */}
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-sm font-medium text-blue-600">AI</span>
                </div>
              )}
              
              {/* Mensaje */}
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white ml-2'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              </div>

              {/* Avatar del usuario */}
              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center ml-2">
                  <span className="text-sm font-medium text-white">
                    {profile?.full_name?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Mensaje en streaming */}
          {currentMessage && (
            <div className="flex justify-start">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <span className="text-sm font-medium text-blue-600">AI</span>
              </div>
              <div className="max-w-[70%] px-4 py-2 rounded-lg bg-gray-100">
                <div className="text-sm whitespace-pre-wrap">{currentMessage}</div>
              </div>
            </div>
          )}

          {/* Indicador de escritura */}
          {isTyping && !currentMessage && (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <span className="text-sm font-medium text-blue-600">AI</span>
              </div>
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
      </div>

      {/* Área de entrada */}
      <div className="border-t p-4">
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
            {isTyping ? 'Procesando...' : 'Enviar'}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Presiona Enter para enviar, Shift + Enter para nueva línea
        </div>
      </div>
    </div>
  );
}
