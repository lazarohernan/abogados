// src/components/settings/SettingsPanel.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function SettingsPanel({ profile }: { profile: UserProfile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile.full_name,
    email: profile.email,
    phone: profile.phone || '',
    address: profile.address || '',
  });

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile.id);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      try {
        await supabase.auth.signOut();
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', profile.id);

        if (error) throw error;
        router.push('/');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Configuración de la cuenta</h2>
        
        {/* Datos personales */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Datos personales</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            {/* Más campos... */}
          </div>
          <button
            onClick={handleUpdateProfile}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            {loading ? 'Actualizando...' : 'Guardar cambios'}
          </button>
        </div>

        {/* Suscripción */}
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-lg font-semibold">Suscripción</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p>Plan actual: {profile.subscription_tier || 'No suscrito'}</p>
            <p>Estado: {profile.subscription_status}</p>
            {profile.trial_end && (
              <p>Prueba finaliza: {new Date(profile.trial_end).toLocaleDateString()}</p>
            )}
          </div>
          <button
            onClick={() => router.push('/pricing')}
            className="text-blue-600 hover:underline"
          >
            Gestionar suscripción
          </button>
        </div>

        {/* Eliminar cuenta */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-red-600">Zona de peligro</h3>
          <p className="text-sm text-gray-600 mt-2">
            Una vez eliminada tu cuenta, todos tus datos serán borrados permanentemente.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Eliminar cuenta
          </button>
        </div>
      </div>
    </div>
  );
}