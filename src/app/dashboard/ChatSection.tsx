'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ChatSection from './ChatSection';

export default function DashboardPage() {
  const [profile, setProfile] = useState<{ full_name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string; created_at?: string }[]
  >([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error) setProfile({ full_name: profileData.full_name, email: profileData.email });
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

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
      isTyping={false}
      inputMessage=""
      setInputMessage={() => {}}
      handleSendMessage={() => {}}
      subscriptionStatus="active"
    />
  );
}
