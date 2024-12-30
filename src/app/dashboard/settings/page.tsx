'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '../DashboardLayout';
import SettingsSection from '@/components/settings/SettingsSection';

interface UserProfile {
  full_name: string;
  email: string;
  subscription_status?: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Usuario no autenticado.');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;

      setProfile(data);
    } catch (err) {
      console.error('Error al obtener el perfil:', err);
    }
  }

  if (!profile) return <div>Cargando...</div>;

  return (
    <DashboardLayout profile={profile}>
      <SettingsSection profile={profile} />
    </DashboardLayout>
  );
}
