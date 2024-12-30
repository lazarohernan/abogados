'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '../DashboardLayout';
import SettingsSection from '@/components/settings/SettingsSection';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  subscription_status?: 'trial' | 'active' | 'inactive';
  trial_end?: string | null;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  }

  if (!profile) return <div>Cargando...</div>;

  return (
    <DashboardLayout profile={profile} activeSection="settings">
      <SettingsSection profile={profile} />
    </DashboardLayout>
  );
}
