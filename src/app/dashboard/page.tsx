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

export default function DashboardPage() {
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

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(profileData);
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
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Simulación de respuesta de IA
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Esta es una respuesta simulada. Aquí se conectará la IA.',
          created_at: new Date().toISOString(),
        }]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
    }
  };

  if (loading || !profile) {
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
