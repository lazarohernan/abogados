'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../DashboardLayout';
import SettingsSection from '@/components/settings/SettingsSection';
import UserProfile from '@/types/profile';

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const response = await fetch('/api/profile'); // Llama a tu API
      if (!response.ok) {
        throw new Error('Error al obtener el perfil'); // Maneja errores HTTP
      }

      const data = await response.json(); // Procesa la respuesta como JSON
      setProfile(data as UserProfile); // Asegúrate de que `data` coincide con `UserProfile`
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  if (!profile) return <div>Cargando...</div>;

  return (
    <DashboardLayout profile={profile} activeSection="settings">
      <SettingsSection profile={profile} />
    </DashboardLayout>
  );
}
