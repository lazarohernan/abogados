'use client';

import { useState, useEffect } from 'react';
import UserProfile from '@/types/profile';
import DashboardLayout from '../DashboardLayout';
import SettingsSection from '@/components/settings/SettingsSection';

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data } = await fetch('/api/profile'); // Ejemplo de API
    setProfile(data as UserProfile);
  }

  if (!profile) return <div>Cargando...</div>;

  return (
    <DashboardLayout profile={profile} activeSection="settings">
      <SettingsSection profile={profile} />
    </DashboardLayout>
  );
}
