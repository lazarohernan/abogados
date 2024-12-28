'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DashboardLayout from './DashboardLayout';
import ChatSection from './ChatSection';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  subscription_status: 'trial' | 'active' | 'inactive';
  subscription_tier?: 'monthly' | 'yearly' | null;
  trial_end?: string | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: string; content: string; created_at?: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error al obtener el perfil:', error.message);
        setProfile(null);
        return;
      }

      setProfile(profile);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const newMessage = {
      role: 'user',
      content: inputMessage,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage })
      });
      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        created_at: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error al obtener respuesta:', error);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  return (
    <DashboardLayout profile={profile} activeSection="chat">
      <ChatSection
        profile={profile}
        messages={messages}
        isTyping={isTyping}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        subscriptionStatus={profile?.subscription_status || 'inactive'}
      />
    </DashboardLayout>
  );
}
