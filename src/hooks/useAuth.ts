import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async ({
    email,
    password,
    fullName,
  }: {
    email: string;
    password: string;
    fullName: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Crear usuario en Auth
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (!user) throw new Error('No se pudo crear el usuario');

      // 2. Crear perfil en la tabla profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            email: email,
            full_name: fullName,
            subscription_status: 'trial',
            trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días de prueba
          },
        ]);

      if (profileError) throw profileError;

      return { user, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en el registro';
      setError(errorMessage);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp,
    loading,
    error,
  };
};