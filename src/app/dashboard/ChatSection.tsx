'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

interface UserProfile {
  full_name: string;
  email: string;
}

interface ChatSectionProps {
  profile: UserProfile;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  isTyping: boolean;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  subscriptionStatus: 'trial' | 'active' | 'inactive';
  trialEnd?: string | null;
}

export default function ChatSection({
  profile,
  messages,
  setMessages,
  isTyping,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  subscriptionStatus,
  trialEnd,
}: ChatSectionProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

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

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Área de chat */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-sm font-medium text-blue-600">AI</span>
                </div>
              )}
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
            {isTyping ? (
              <span className="flex items-center space-x-2">
                <span className="text-sm">Procesando</span>
              </span>
            ) : (
              <span>Enviar</span>
            )}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Presiona Enter para enviar, Shift + Enter para nueva línea
        </div>
      </div>

      {/* Información de suscripción */}
      <div className="border-t p-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Suscripción: <span className="font-medium">{subscriptionStatus}</span>
            </p>
            {trialEnd && (
              <p className="text-sm text-gray-600">
                Vence: {new Date(trialEnd).toLocaleDateString()}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-red-600 text-sm hover:underline"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
