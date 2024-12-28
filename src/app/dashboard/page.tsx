'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ChatSection from './ChatSection';

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        setProfile(profile);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <ChatSection
      profile={profile}
      messages={messages}
      setMessages={setMessages}
    />
  );
}
