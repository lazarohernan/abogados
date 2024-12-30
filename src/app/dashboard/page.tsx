'use client';

import { useState } from 'react';
import ChatSection from './ChatSection';
import DashboardLayout from './DashboardLayout';

interface UserProfile {
  full_name: string;
  email: string;
  subscription_status: 'trial' | 'active' | 'inactive';
  trial_end?: string | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export default function DashboardPage() {
  const [profile] = useState<UserProfile>({
    full_name: 'Usuario Ejemplo',
    email: 'usuario@ejemplo.com',
    subscription_status: 'active',
    trial_end: '2023-12-31',
  });

  const [messages, setMessages] = useState<Message[]>([
    { role: 'user', content: 'Hola', created_at: new Date().toISOString() },
    { role: 'assistant', content: '¡Hola! ¿En qué puedo ayudarte?', created_at: new Date().toISOString() },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      role: 'user', // Asegúrate de que el valor sea correcto según la interfaz
      content: inputMessage,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant', // Asegúrate de que el valor sea correcto según la interfaz
        content: 'Esta es una respuesta de prueba.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <DashboardLayout profile={profile}>
      <ChatSection
        profile={profile}
        messages={messages}
        setMessages={setMessages}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        isTyping={isTyping}
      />
    </DashboardLayout>
  );
}
