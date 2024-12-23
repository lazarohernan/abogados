'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Register() {
  const router = useRouter();
  const { signUp, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Iniciando registro...');

    if (formData.password !== formData.confirmPassword) {
      setStatusMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      setStatusMessage('Creando usuario...');
      const { user, profile, error } = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });

      if (error) {
        setStatusMessage(`Error: ${error}`);
        return;
      }

      if (user && profile) {
        setStatusMessage('Registro exitoso! Redirigiendo...');
        router.push('/dashboard');
      } else {
        setStatusMessage('Error: No se pudo completar el registro');
      }
    } catch (err) {
      setStatusMessage(`Error inesperado: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  // ... resto del código del formulario igual que antes ...

  // Agregar mensaje de estado en el formulario:
  {statusMessage && (
    <div className="mt-4 p-4 rounded-md bg-blue-50 text-blue-700">
      {statusMessage}
    </div>
  )}
