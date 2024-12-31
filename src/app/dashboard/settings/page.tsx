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
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile'); // Llama a tu API
        if (!response.ok) {
          throw new Error('Error al obtener el perfil'); // Maneja errores HTTP
        }

        const data = await response.json();
        setProfile(data as UserProfile); // Asegúrate de que `data` coincide con `UserProfile`
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err instanceof Error) {
          setError(err.message); // Maneja errores conocidos
        } else {
          setError('Ocurrió un error desconocido'); // Maneja errores desconocidos
        }
      } finally {
        setIsLoading(false); // Asegúrate de desactivar la carga siempre
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return null;

  return (
    <DashboardLayout profile={profile} activeSection="settings">
      <SettingsSection profile={profile} />
    </DashboardLayout>
  );
}
