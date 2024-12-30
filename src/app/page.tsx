'use client';

import { useState } from 'react';
import DashboardLayout from './dashboard/DashboardLayout';
import ChatSection from './dashboard/ChatSection';

interface UserProfile {
  full_name: string;
  email: string;
  subscription_status: 'trial' | 'active' | 'inactive'; // Tipo estricto
  trial_end?: string | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile>({
    full_name: 'Usuario de Prueba',
    email: 'usuario@ejemplo.com',
    subscription_status: 'active' as 'trial' | 'active' | 'inactive', // Forzar tipo
    trial_end: '2023-12-31',
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  return (
    <DashboardLayout profile={profile} activeSection="chat">
      <ChatSection
        profile={profile}
        messages={messages}
        setMessages={setMessages}
        isTyping={isTyping}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={() => {
          if (inputMessage.trim()) {
            const newMessage: Message = {
              role: 'user',
              content: inputMessage,
              created_at: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, newMessage]);
            setInputMessage('');
            setIsTyping(true);

            // Simulación de respuesta del asistente
            setTimeout(() => {
              const responseMessage: Message = {
                role: 'assistant',
                content: 'Esta es una respuesta simulada.',
                created_at: new Date().toISOString(),
              };

              setMessages((prev) => [...prev, responseMessage]);
              setIsTyping(false);
            }, 1000);
          }
        }}
      />
    </DashboardLayout>
  );
}
