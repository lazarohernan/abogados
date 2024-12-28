'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ChatSection from './ChatSection';

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: userResponse, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error('Error obteniendo usuario:', userError.message);
          setLoading(false);
          return;
        }

        const user = userResponse?.user;

        if (!user || !user.id) {
          console.warn('Usuario no autenticado o sin ID');
          setLoading(false);
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
          setProfile({
            full_name: profileData.full_name,
            email: profileData.email,
            subscription_status: profileData.subscription_status,
            trial_end: profileData.trial_end,
          });
        }
      } catch (error) {
        console.error('Error inesperado:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isTyping) return;

    const newMessage: Message = {
      role: 'user',
      content: inputMessage,
      created_at: new Date().toISOString(),
    };

    setMessages((prev: Message[]) => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulación de la respuesta de la IA
    setTimeout(() => {
      const responseMessage: Message = {
        role: 'assistant',
        content: 'Esta es una respuesta simulada. Aquí se conectará la IA.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev: Message[]) => [...prev, responseMessage]);
      setIsTyping(false);
    }, 1000);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Perfil no encontrado</div>;
  }

  return (
    <ChatSection
      profile={profile}
      messages={messages}
      setMessages={setMessages}
      isTyping={isTyping}
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      handleSendMessage={handleSendMessage}
      subscriptionStatus={profile.subscription_status}
      trialEnd={profile.trial_end}
    />
  );
}
