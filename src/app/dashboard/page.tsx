'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
  const [profile, setProfile] = useState<UserProfile>({
    full_name: 'Usuario',
    email: 'usuario@ejemplo.com',
    subscription_status: 'active', // Cambiar este valor para probar
    trial_end: '2023-12-31',
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Aquí podrías cargar datos dinámicos desde Supabase o cualquier API.
    // Asegúrate de mapear `subscription_status` a los valores permitidos.
    const fetchProfile = async () => {
      const userProfile = {
        full_name: 'Usuario',
        email: 'usuario@ejemplo.com',
        subscription_status: 'active', // Ajusta este valor según los datos reales
        trial_end: '2023-12-31',
      };
      setProfile({
        ...userProfile,
        subscription_status: userProfile.subscription_status as 'trial' | 'active' | 'inactive',
      });
    };

    fetchProfile();
  }, []);

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
