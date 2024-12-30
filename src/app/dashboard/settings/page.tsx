// src/app/dashboard/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '../DashboardLayout';
import SettingsSection from '@/components/SettingsSection';

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

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
    <DashboardLayout profile={profile} activeSection="settings">
      <SettingsSection profile={profile} />
    </DashboardLayout>
  );
}
