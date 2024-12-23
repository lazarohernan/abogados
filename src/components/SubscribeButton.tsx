'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/lib/supabase';

// Verifica que la clave pública de Stripe está disponible
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripePublicKey) {
  console.error('Missing Stripe public key');
}

const stripePromise = loadStripe(stripePublicKey!);

interface SubscribeButtonProps {
  priceId: string;
  planType: 'monthly' | 'yearly';
  className?: string;
}

export default function SubscribeButton({ 
  priceId, 
  planType,
  className = ''
}: SubscribeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Iniciando proceso de suscripción...');

      // Verificar si el usuario está autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Auth check:', { user, authError });

      if (authError) {
        throw new Error('Error de autenticación: ' + authError.message);
      }

      if (!user) {
        console.log('Usuario no autenticado, redirigiendo a login...');
        router.push('/login');
        return;
      }

      console.log('Creando sesión de checkout...', {
        priceId,
        userId: user.id,
        email: user.email
      });

      // Crear sesión de checkout
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          customerEmail: user.email,
        }),
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la sesión de checkout');
      }

      if (!data.sessionId) {
        throw new Error('No se recibió el ID de sesión');
      }

      // Redirigir a Stripe Checkout
      console.log('Redirigiendo a Stripe checkout...');
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Error al cargar Stripe');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        throw stripeError;
      }

    } catch (error) {
      console.error('Error detallado:', error);
      setError(error instanceof Error ? error.message : 'Error al procesar la suscripción');
      alert(error instanceof Error ? error.message : 'Error al procesar la suscripción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={`w-full px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? 'Procesando...' : `Suscribirse al plan ${planType === 'monthly' ? 'mensual' : 'anual'}`}
    </button>
  );
}
