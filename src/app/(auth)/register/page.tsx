'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { storage } from '@/lib/storage';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (formData.fullName.length < 3) {
      errors.fullName = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Email inválido';
    }

    if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (validationErrors) {
      setError('Por favor, corrija los errores del formulario');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Crear el perfil en la tabla profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: formData.email,
              full_name: formData.fullName,
              subscription_status: 'trial',
              trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ]);

        if (profileError) throw profileError;

        // Guardar el email para el login
        storage.set('rememberedEmail', formData.email);
        
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  // No renderizar nada hasta que el componente esté montado
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* ... resto del JSX igual que antes ... */}
    </div>
  );
}
