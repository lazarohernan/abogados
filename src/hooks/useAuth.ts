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

      // 1. Registro en Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        console.error('Error en signUp:', signUpError);
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error('No se recibieron datos del usuario');
      }

      console.log('Usuario creado:', authData.user);

      // 2. Insertar en profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: email,
          full_name: fullName,
          subscription_status: 'trial',
          trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error al crear perfil:', profileError);
        // Intenta obtener más detalles del error
        const { data: errorDetails, error: errorCheckError } = await supabase
          .from('profiles')
          .select()
          .eq('id', authData.user.id);
          
        console.log('Detalles de verificación:', { errorDetails, errorCheckError });
        throw profileError;
      }

      console.log('Perfil creado:', profileData);

      return {
        user: authData.user,
        profile: profileData,
        error: null
      };

    } catch (err) {
      console.error('Error completo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error en el registro';
      setError(errorMessage);
      return { user: null, profile: null, error: errorMessage };
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
