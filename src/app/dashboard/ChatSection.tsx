'use client';

import { useEffect, useState } from 'react';
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
  subscriptionStatus: string;
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
}: ChatSectionProps) {
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: userResponse, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error('Error obteniendo usuario:', userError.message);
          return;
        }

        const user = userResponse?.user;

        if (!user || !user.id) {
          console.warn('Usuario no autenticado o sin ID');
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error obteniendo perfil:', profileError.message);
        } else {
          console.log('Perfil cargado correctamente:', profileData);
        }
      } catch (error) {
        console.error('Error inesperado:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-4">
      <h1>Bienvenido, {profile.full_name}</h1>
      {/* Renderiza mensajes */}
      {messages.map((msg, index) => (
        <div key={index}>
          <strong>{msg.role === 'user' ? 'Tú' : 'IA'}:</strong> {msg.content}
        </div>
      ))}
    </div>
  );
}
