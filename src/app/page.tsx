'use client';

import { useState } from 'react';
import DashboardLayout from './dashboard/DashboardLayout'; // Ruta corregida
import ChatSection from './dashboard/ChatSection'; // Ruta corregida

export default function Page() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages((prev) => [...prev, { role: 'user', content: inputMessage }]);
      setInputMessage('');
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Respuesta del asistente' }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const profile = {
    full_name: 'Usuario de Prueba',
    email: 'usuario@ejemplo.com',
    subscription_status: 'active',
    trial_end: '2023-12-31',
  };

  return (
    <DashboardLayout profile={profile} activeSection="chat">
      <ChatSection
        profile={profile}
        messages={messages}
        isTyping={isTyping}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        subscriptionStatus={profile.subscription_status}
        trialEnd={profile.trial_end || undefined}
      />
    </DashboardLayout>
  );
}
