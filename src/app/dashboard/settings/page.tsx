'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../DashboardLayout';
import SettingsSection from '@/components/settings/SettingsSection';
import UserProfile from '@/types/profile';

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 10000); // Manejo de carga

    fetchProfile();

    return () => clearTimeout(timeout);
  }, []);

  async function fetchProfile() {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Error al obtener el perfil');
      }

      const data = await response.json();
      setProfile(data as UserProfile);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    }
  }

  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>Cargando...</div>;
  if (!profile) return null;

  return (
    <DashboardLayout profile={profile} activeSection="settings">
      <SettingsSection profile={profile} />
    </DashboardLayout>
  );
}
