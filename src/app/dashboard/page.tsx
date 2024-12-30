// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardLayout from './DashboardLayout';
import ChatSection from '@/components/ChatSection';
import useChat from '@/hooks/useChat';

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { messages, isTyping, inputMessage, setInputMessage, sendMessage } = useChat();

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
    }
  }

  if (!profile) return null;

  return (
    <DashboardLayout profile={profile} activeSection="chat">
      <ChatSection
        profile={profile}
        messages={messages}
        isTyping={isTyping}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={() => sendMessage(inputMessage)}
        subscriptionStatus={profile.subscription_status}
        trialEnd={profile.trial_end}
      />
    </DashboardLayout>
  );
}
